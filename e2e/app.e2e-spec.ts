import { AngularBootlegPage } from './app.po';

describe('angular-bootleg App', function() {
  let page: AngularBootlegPage;

  beforeEach(() => {
    page = new AngularBootlegPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
