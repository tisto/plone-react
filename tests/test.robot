*** Settings ***

Library         Selenium2Library  timeout=10  implicit_wait=0
Library         WebpackLibrary
Suite Setup     Suite Setup
Suite Teardown  Suite Teardown


*** Test Cases ***

Scenario: Open Headless Browser
  Go To  https://kitconcept.com
  Wait until page contains  kitconcept
  Page should contain  kitconcept


*** Keywords ***

Suite Setup
  Start Webpack  yarn dev  check=Webpack development server listening
  ${options}=  Evaluate  sys.modules['selenium.webdriver'].ChromeOptions()  sys, selenium.webdriver
  Call Method  ${options}  add_argument  headless
  Call Method  ${options}  add_argument  disable-extensions
  Call Method  ${options}  add_argument  start-maximized
  Create WebDriver  Chrome  chrome_options=${options}

Suite Teardown
  Stop Webpack
  Close Browser