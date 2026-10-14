import { test, expect, Page } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';
import type { TIngredient } from '../src/utils/types';

const hars = path.resolve(__dirname, 'hars');

function readHarResponse<T>(fileName: string): T {
  const har = JSON.parse(readFileSync(path.join(hars, fileName), 'utf8'));
  return JSON.parse(har.log.entries[0].response.content.text);
}

const ingredients = readHarResponse<{ data: TIngredient[] }>(
  'ingredients.har'
).data;
const userResponse = readHarResponse<{ user: { name: string } }>('user.har');
const orderResponse = readHarResponse<{ order: { number: number } }>(
  'order.har'
);
const [bun, otherBun, filling, sauce] = ingredients;
const accessToken = 'Bearer mock-access-token';

const getConstructor = (page: Page) => page.getByTestId('burger-constructor');
const getModal = (page: Page) => page.getByTestId('modal');

async function addIngredient(page: Page, ingredient: TIngredient) {
  const card = page.getByRole('listitem').filter({
    has: page.locator(`a[href="/ingredients/${ingredient._id}"]`)
  });
  await card.getByRole('button', { name: 'Добавить', exact: true }).click();
}

async function expectEmptyConstructor(page: Page) {
  await expect(
    getConstructor(page).getByText('Выберите булки', { exact: true })
  ).toHaveCount(2);
  await expect(
    getConstructor(page).getByText('Выберите начинку', { exact: true })
  ).toBeVisible();
  await expect(getConstructor(page).getByRole('listitem')).toHaveCount(0);
}

test.beforeEach(async ({ page, context }) => {
  // Неизвестные вызовы API никогда не должны доходить до реального бэкенда
  await page.route('**/api/**', (route) => route.abort());
  await page.routeFromHAR(path.join(hars, 'ingredients.har'), {
    url: '**/api/ingredients',
    notFound: 'abort'
  });
  await page.routeFromHAR(path.join(hars, 'user.har'), {
    url: '**/api/auth/user',
    notFound: 'abort'
  });
  await page.routeFromHAR(path.join(hars, 'order.har'), {
    url: '**/api/orders',
    notFound: 'abort'
  });
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
    getConstructor(page).getByText(`${bun.name} (верх)`, { exact: true })
  ).toBeVisible();
  await expect(
    getConstructor(page).getByText(`${bun.name} (низ)`, { exact: true })
  ).toBeVisible();
  await expect(getConstructor(page).getByText('Выберите булки')).toHaveCount(0);
});

test('добавление начинки и соуса из списка в конструктор', async ({ page }) => {
  await addIngredient(page, filling);
  await addIngredient(page, sauce);
  await expect(
    getConstructor(page).getByText(filling.name, { exact: true })
  ).toBeVisible();
  await expect(
    getConstructor(page).getByText(sauce.name, { exact: true })
  ).toBeVisible();
  await expect(getConstructor(page).getByRole('listitem')).toHaveCount(2);
  await expect(getConstructor(page).getByText('Выберите начинку')).toHaveCount(
    0
  );
});

test('замена булки без потери начинки', async ({ page }) => {
  await addIngredient(page, bun);
  await addIngredient(page, filling);
  await addIngredient(page, otherBun);
  await expect(
    getConstructor(page).getByText(`${otherBun.name} (верх)`, { exact: true })
  ).toBeVisible();
  await expect(
    getConstructor(page).getByText(`${otherBun.name} (низ)`, { exact: true })
  ).toBeVisible();
  await expect(
    getConstructor(page).getByText(new RegExp(bun.name))
  ).toHaveCount(0);
  await expect(
    getConstructor(page).getByText(filling.name, { exact: true })
  ).toBeVisible();
});

test('открытие деталей ингредиента и закрытие крестиком', async ({ page }) => {
  await page.getByRole('link', { name: new RegExp(filling.name) }).click();
  await expect(getModal(page)).toBeVisible();
  await expect(
    getModal(page).getByRole('heading', { name: filling.name, exact: true })
  ).toBeVisible();
  const nutrients: [string, number][] = [
    ['Калории, ккал', filling.calories],
    ['Белки, г', filling.proteins],
    ['Жиры, г', filling.fat],
    ['Углеводы, г', filling.carbohydrates]
  ];
  for (const [label, value] of nutrients) {
    const nutrient = getModal(page)
      .getByRole('listitem')
      .filter({ hasText: label });
    await expect(
      nutrient.getByText(String(value), { exact: true })
    ).toBeVisible();
  }
  await expect(page).toHaveURL(`/ingredients/${filling._id}`);
  await page.getByTestId('modal-close').click();
  await expect(getModal(page)).toHaveCount(0);
  await expect(page.getByTestId('modal-overlay')).toHaveCount(0);
  await expect(page).toHaveURL('/');
});

test('закрытие деталей ингредиента кликом на оверлей', async ({ page }) => {
  await page.getByRole('link', { name: new RegExp(bun.name) }).click();
  await expect(
    getModal(page).getByRole('heading', { name: bun.name, exact: true })
  ).toBeVisible();
  await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });
  await expect(getModal(page)).toHaveCount(0);
  await expect(page.getByTestId('modal-overlay')).toHaveCount(0);
  await expect(page).toHaveURL('/');
});

test('закрытие деталей ингредиента клавишей Escape', async ({ page }) => {
  await page.getByRole('link', { name: new RegExp(bun.name) }).click();
  await expect(getModal(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(getModal(page)).toHaveCount(0);
  await expect(page.getByTestId('modal-overlay')).toHaveCount(0);
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
  await expect(getModal(page)).toBeVisible();
  await expect(
    getModal(page).getByText(String(orderResponse.order.number), {
      exact: true
    })
  ).toBeVisible();
  await expectEmptyConstructor(page);
  await page.getByTestId('modal-close').click();
  await expect(getModal(page)).toHaveCount(0);
  await expect(page.getByTestId('modal-overlay')).toHaveCount(0);
  await expect(page).toHaveURL('/');
  await expectEmptyConstructor(page);
});
