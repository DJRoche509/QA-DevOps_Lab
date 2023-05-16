const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"), 1000);
    
    // const pageTitle = await driver.findElement(By.name("Duel Duo"));
    // expect(await pageTitle).toBe("Duel Duo")
  });
  
  //test the functionality
  test('Draw button display the div with id="choices" ', async () => {
    
    //Load the test page
    await driver.get("http://localhost:8000");
    // Wait till title of the page is named "Duel Duo"
    await driver.wait(until.titleIs("Duel Duo"), 1000);
    // Find and click the "Draw" button
    await driver.findElement(By.css('#draw')).click();
    // wait for the div with id = "choices" to be shown
    await driver.wait(until.elementLocated(By.css('#choices')), 3000);

    //Find the dive with id "choices" and verify that it is desplayed
    const choicesDiv = await driver.findElement(By.id('choices'));
    expect(await choicesDiv.isDisplayed()).toBeTruthy();
  });


  test('“Add to Duo” button displays the div with id = “player-duo” ', async() => {
    //Load the test page
    await driver.get("http://localhost:8000");
    // Wait till title of the page is named "Duel Duo"
    await driver.wait(until.titleIs("Duel Duo"), 1000);
    // Find and click the "Draw" button
    await driver.findElement(By.css('#draw')).click();
    // wait for the div with id = "choices" to be shown
    await driver.wait(until.elementLocated(By.css('#choices')), 3000);
    // FInd all "Add to Duo" buttons and click the first one 
    const addToDuoBtns = await driver.findElements(By.css('button'));
    await addToDuoBtns[1].click();
    // Wait for the with id="player-duo" to be displayed
    await driver.wait(until.elementLocated(By.id('player-duo')),2000);

    //Find the div with id "player-duo" and verify that it is desplayed
    const playerDuoDiv = await driver.findElement(By.id('player-duo'));
    expect(await playerDuoDiv.isDisplayed()).toBeTruthy();
  });
});  
