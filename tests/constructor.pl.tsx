import { test, expect, Page } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';
import userResponse from './fixtures/user.json';
import orderResponse from './fixtures/order.json';
import type { TIngredient } from '../src/utils/types';

const fixtures = path.resolve(__dirname, 'fixtures');
const har = JSON.parse(
  readFileSync(path.join(fixtures, 'ingredients.har'), 'utf8')
);
const ingredients: TIngredient[] = JSON.parse(
  har.log.entries[0].response.content.text
).data;
const [bun, otherBun, filling, sauce] = ingredients;
const accessToken = 'Bearer mock-access-token';

const constructor = (page: Page) =>
  page.locator('section').filter({
    has: page.getByRole('button', { name: 'Оформить заказ', exact: true })
  });
const modal = (page: Page) => page.locator('#modals > div').first();

async function addIngredient(page: Page, ingredient: TIngredient) {
  const card = page.getByRole('listitem').filter({
    has: page.locator(`a[href="/ingredients/${ingredient._id}"]`)
  });
  await card.getByRole('button', { name: 'Добавить', exact: true }).click();
}

async function expectEmptyConstructor(page: Page) {
  await expect(
    constructor(page).getByText('Выберите булки', { exact: true })
  ).toHaveCount(2);
  await expect(
    constructor(page).getByText('Выберите начинку', { exact: true })
  ).toBeVisible();
  await expect(constructor(page).getByRole('listitem')).toHaveCount(0);
}

test.beforeEach(async ({ page, context }) => {
  // Unknown API calls must never reach the real backend.
  await page.route('**/api/**', (route) => route.abort());
  await page.routeFromHAR(path.join(fixtures, 'ingredients.har'), {
    url: '**/api/ingredients',
    notFound: 'abort'
  });
  await page.route('**/api/auth/user', (route) =>
    route.fulfill({ json: userResponse })
  );
  await page.route('**/api/orders', (route) =>
    route.fulfill({ json: orderResponse })
  );
  await context.addCookies([
    { name: 'accessToken', value: accessToken, url: 'http://localhost:4000' }
  ]);
  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'mock-refresh-token');
  });
  await page.goto('/');
  await expect(
    page.getByRole('link', { name: new RegExp(bun.name) })
  ).toBeVisible();
  await expectEmptyConstructor(page);
});

test('добавление булки в верхнюю и нижнюю части конструктора', async ({
  page
}) => {
  await addIngredient(page, bun);
  await expect(
    constructor(page).getByText(`${bun.name} (верх)`, { exact: true })
  ).toBeVisible();
  await expect(
    constructor(page).getByText(`${bun.name} (низ)`, { exact: true })
  ).toBeVisible();
  await expect(constructor(page).getByText('Выберите булки')).toHaveCount(0);
});

test('добавление начинки и соуса из списка в конструктор', async ({ page }) => {
  await addIngredient(page, filling);
  await addIngredient(page, sauce);
  await expect(
    constructor(page).getByText(filling.name, { exact: true })
  ).toBeVisible();
  await expect(
    constructor(page).getByText(sauce.name, { exact: true })
  ).toBeVisible();
  await expect(constructor(page).getByRole('listitem')).toHaveCount(2);
  await expect(constructor(page).getByText('Выберите начинку')).toHaveCount(0);
});

test('замена булки без потери начинки', async ({ page }) => {
  await addIngredient(page, bun);
  await addIngredient(page, filling);
  await addIngredient(page, otherBun);
  await expect(
    constructor(page).getByText(`${otherBun.name} (верх)`, { exact: true })
  ).toBeVisible();
  await expect(
    constructor(page).getByText(`${otherBun.name} (низ)`, { exact: true })
  ).toBeVisible();
  await expect(constructor(page).getByText(new RegExp(bun.name))).toHaveCount(
    0
  );
  await expect(
    constructor(page).getByText(filling.name, { exact: true })
  ).toBeVisible();
});

test('открытие деталей ингредиента и закрытие крестиком', async ({ page }) => {
  await page.getByRole('link', { name: new RegExp(filling.name) }).click();
  await expect(modal(page)).toBeVisible();
  await expect(
    modal(page).getByRole('heading', { name: filling.name, exact: true })
  ).toBeVisible();
  await expect(modal(page).getByText('Калории, ккал')).toBeVisible();
  await expect(page).toHaveURL(`/ingredients/${filling._id}`);
  await modal(page).getByRole('button').click();
  await expect(page.locator('#modals')).toBeEmpty();
  await expect(page).toHaveURL('/');
});

test('закрытие деталей ингредиента кликом на оверлей', async ({ page }) => {
  await page.getByRole('link', { name: new RegExp(bun.name) }).click();
  await expect(
    modal(page).getByRole('heading', { name: bun.name, exact: true })
  ).toBeVisible();
  await page
    .locator('#modals > div')
    .last()
    .click({ position: { x: 10, y: 10 } });
  await expect(page.locator('#modals')).toBeEmpty();
  await expect(page).toHaveURL('/');
});

test('закрытие деталей ингредиента клавишей Escape', async ({ page }) => {
  await page.getByRole('link', { name: new RegExp(bun.name) }).click();
  await expect(modal(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#modals')).toBeEmpty();
  await expect(page).toHaveURL('/');
});

test('создание заказа, верный номер, очистка конструктора и закрытие окна', async ({
  page
}) => {
  await expect(
    page.getByText(userResponse.user.name, { exact: true })
  ).toBeVisible();
  await addIngredient(page, bun);
  await addIngredient(page, filling);
  await addIngredient(page, sauce);
  const requestPromise = page.waitForRequest(
    (request) =>
      request.url().endsWith('/api/orders') && request.method() === 'POST'
  );
  await page
    .getByRole('button', { name: 'Оформить заказ', exact: true })
    .click();
  const request = await requestPromise;
  expect(request.headers().authorization).toBe(accessToken);
  expect(request.postDataJSON()).toEqual({
    ingredients: [bun._id, filling._id, sauce._id, bun._id]
  });
  await expect(modal(page)).toBeVisible();
  await expect(
    modal(page).getByText(String(orderResponse.order.number), { exact: true })
  ).toBeVisible();
  await expectEmptyConstructor(page);
  await modal(page).getByRole('button').click();
  await expect(page.locator('#modals')).toBeEmpty();
  await expect(page).toHaveURL('/');
  await expectEmptyConstructor(page);
});
