import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { WeightComponentsPage, WeightDeleteDialog, WeightUpdatePage } from './weight.page-object';

const expect = chai.expect;

describe('Weight e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let weightComponentsPage: WeightComponentsPage;
  let weightUpdatePage: WeightUpdatePage;
  let weightDeleteDialog: WeightDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Weights', async () => {
    await navBarPage.goToEntity('weight');
    weightComponentsPage = new WeightComponentsPage();
    await browser.wait(ec.visibilityOf(weightComponentsPage.title), 5000);
    expect(await weightComponentsPage.getTitle()).to.eq('Weights');
    await browser.wait(ec.or(ec.visibilityOf(weightComponentsPage.entities), ec.visibilityOf(weightComponentsPage.noResult)), 1000);
  });

  it('should load create Weight page', async () => {
    await weightComponentsPage.clickOnCreateButton();
    weightUpdatePage = new WeightUpdatePage();
    expect(await weightUpdatePage.getPageTitle()).to.eq('Create or edit a Weight');
    await weightUpdatePage.cancel();
  });

  it('should create and save Weights', async () => {
    const nbButtonsBeforeCreate = await weightComponentsPage.countDeleteButtons();

    await weightComponentsPage.clickOnCreateButton();

    await promise.all([
      weightUpdatePage.setDateTimeInput('2000-12-31'),
      weightUpdatePage.setWeightInput('5'),
      weightUpdatePage.userSelectLastOption(),
    ]);

    expect(await weightUpdatePage.getDateTimeInput()).to.eq('2000-12-31', 'Expected dateTime value to be equals to 2000-12-31');
    expect(await weightUpdatePage.getWeightInput()).to.eq('5', 'Expected weight value to be equals to 5');

    await weightUpdatePage.save();
    expect(await weightUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await weightComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Weight', async () => {
    const nbButtonsBeforeDelete = await weightComponentsPage.countDeleteButtons();
    await weightComponentsPage.clickOnLastDeleteButton();

    weightDeleteDialog = new WeightDeleteDialog();
    expect(await weightDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Weight?');
    await weightDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(weightComponentsPage.title), 5000);

    expect(await weightComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
