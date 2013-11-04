'use strict';

describe('Hamster App', function() {

  beforeEach(function() {
    browser().navigateTo('../index.html');
  });

  it('should stay on the default page', function() {
    expect(browser().location().url()).toBe("");
  });
});
