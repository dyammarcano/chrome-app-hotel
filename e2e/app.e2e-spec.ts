import { ChromeAppHotelPage } from './app.po';

describe('chrome-app-hotel App', function() {
  let page: ChromeAppHotelPage;

  beforeEach(() => {
    page = new ChromeAppHotelPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
