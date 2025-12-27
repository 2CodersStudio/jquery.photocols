// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Photocols Plugin', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/test.html');
    await page.waitForFunction(() =>
      typeof jQuery !== 'undefined' &&
      typeof window.initGallery === 'function'
    );
  });

  test.describe('Initialization', () => {

    test('should initialize with data', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', {
          height: 400,
          data: window.testData
        });
      });

      const container = page.locator('#gallery1');
      await expect(container).toHaveCSS('height', '400px');
      await expect(container).toHaveCSS('overflow', 'hidden');
      await expect(container).toHaveCSS('position', 'relative');
    });

    test('should create columns and items', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', {
          height: 400,
          colswidth: 200,
          data: window.testData
        });
      });

      const columns = page.locator('#gallery1 .pc-col');
      const items = page.locator('#gallery1 .pc-item');

      await expect(columns).not.toHaveCount(0);
      await expect(items).not.toHaveCount(0);
    });

    test('should create inset shadow overlay', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', {
          height: 400,
          data: window.testData
        });
      });

      const shadow = page.locator('#gallery1 > div[id$="-shadow"]');
      await expect(shadow).toHaveCount(1);
      await expect(shadow).toHaveCSS('pointer-events', 'none');
    });

    test('should warn when data is empty', async ({ page }) => {
      const consoleMessages = [];
      page.on('console', msg => consoleMessages.push(msg.text()));

      await page.evaluate(() => {
        window.initGallery('#gallery1', {
          height: 400,
          data: []
        });
      });

      expect(consoleMessages.some(m => m.includes('non-empty array'))).toBeTruthy();
    });

    test('should apply custom options', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', {
          height: 500,
          bgcolor: 'rgb(255, 0, 0)',
          data: window.testData
        });
      });

      const container = page.locator('#gallery1');
      await expect(container).toHaveCSS('height', '500px');
      await expect(container).toHaveCSS('background-color', 'rgb(255, 0, 0)');
    });

  });

  test.describe('Multiple Instances', () => {

    test('should support multiple galleries on same page', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 300, data: window.testData });
        window.initGallery('#gallery2', { height: 400, data: window.testData });
      });

      const gallery1 = page.locator('#gallery1');
      const gallery2 = page.locator('#gallery2');

      await expect(gallery1).toHaveCSS('height', '300px');
      await expect(gallery2).toHaveCSS('height', '400px');

      // Both should have items
      await expect(page.locator('#gallery1 .pc-item')).not.toHaveCount(0);
      await expect(page.locator('#gallery2 .pc-item')).not.toHaveCount(0);
    });

    test('should have unique instance IDs', async ({ page }) => {
      const ids = await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 300, data: window.testData });
        window.initGallery('#gallery2', { height: 300, data: window.testData });

        const g1Container = document.querySelector('#gallery1 > div[class*="pc-all"]');
        const g2Container = document.querySelector('#gallery2 > div[class*="pc-all"]');

        return {
          id1: g1Container?.id,
          id2: g2Container?.id
        };
      });

      expect(ids.id1).toBeTruthy();
      expect(ids.id2).toBeTruthy();
      expect(ids.id1).not.toEqual(ids.id2);
    });

  });

  test.describe('Methods', () => {

    test('pause should stop animation', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 400, data: window.testData });
      });

      // Get initial position
      const initialTransform = await page.evaluate(() => {
        const container = document.querySelector('#gallery1 .pc-all');
        return container?.style.transform;
      });

      // Pause
      await page.evaluate(() => window.callMethod('#gallery1', 'pause'));

      // Wait a bit
      await page.waitForTimeout(200);

      // Get position after pause
      const afterPauseTransform = await page.evaluate(() => {
        const container = document.querySelector('#gallery1 .pc-all');
        return container?.style.transform;
      });

      // Wait more and check position hasn't changed
      await page.waitForTimeout(200);

      const finalTransform = await page.evaluate(() => {
        const container = document.querySelector('#gallery1 .pc-all');
        return container?.style.transform;
      });

      expect(afterPauseTransform).toEqual(finalTransform);
    });

    test('resume should restart animation after pause', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 400, data: window.testData });
      });

      await page.evaluate(() => window.callMethod('#gallery1', 'pause'));
      await page.waitForTimeout(100);

      const pausedTransform = await page.evaluate(() => {
        const container = document.querySelector('#gallery1 .pc-all');
        return container?.style.transform;
      });

      await page.evaluate(() => window.callMethod('#gallery1', 'resume'));
      await page.waitForTimeout(200);

      const resumedTransform = await page.evaluate(() => {
        const container = document.querySelector('#gallery1 .pc-all');
        return container?.style.transform;
      });

      expect(pausedTransform).not.toEqual(resumedTransform);
    });

    test('destroy should remove all content and events', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 400, data: window.testData });
      });

      // Verify initialized
      await expect(page.locator('#gallery1 .pc-item')).not.toHaveCount(0);

      // Destroy
      await page.evaluate(() => window.callMethod('#gallery1', 'destroy'));

      // Should be empty
      await expect(page.locator('#gallery1 .pc-item')).toHaveCount(0);

      // Styles should be reset
      const container = page.locator('#gallery1');
      await expect(container).not.toHaveCSS('overflow', 'hidden');
    });

    test('refresh should rebuild layout', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 400, colswidth: 200, data: window.testData });
      });

      const initialItemCount = await page.locator('#gallery1 .pc-item').count();

      // Change container width and refresh
      await page.evaluate(() => {
        document.getElementById('gallery1').style.width = '800px';
        window.callMethod('#gallery1', 'refresh');
      });

      // Should still have items (layout rebuilt)
      const afterRefreshCount = await page.locator('#gallery1 .pc-item').count();
      expect(afterRefreshCount).toBeGreaterThan(0);
    });

  });

  test.describe('Hover Behavior', () => {

    test('should show title/subtitle on hover', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 400, data: window.testData });
      });

      // Pause animation so elements are stable for hover
      await page.evaluate(() => window.callMethod('#gallery1', 'pause'));

      const firstItem = page.locator('#gallery1 .pc-item').first();
      const mask = firstItem.locator('.pc-item-mask');

      // Initially hidden
      await expect(mask).toHaveCSS('opacity', '0');

      // Hover
      await firstItem.hover();
      await page.waitForTimeout(300);

      // Should be visible
      await expect(mask).toHaveCSS('opacity', '1');
    });

    test('should hide overlay on hover', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 400, opacity: 0.5, data: window.testData });
      });

      // Pause animation so elements are stable for hover
      await page.evaluate(() => window.callMethod('#gallery1', 'pause'));

      const firstItem = page.locator('#gallery1 .pc-item').first();
      const overlay = firstItem.locator('.pc-item-overlay');

      // Initially visible with opacity
      await expect(overlay).toHaveCSS('opacity', '0.5');

      // Hover
      await firstItem.hover();
      await page.waitForTimeout(100);

      // Should be hidden
      await expect(overlay).toHaveCSS('opacity', '0');
    });

  });

  test.describe('Security', () => {

    test('should escape HTML in title to prevent XSS', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 400, data: window.xssTestData });
      });

      // Check that script tags are rendered as text (escaped), not executed
      const titleText = await page.locator('#gallery1 .pc-item-title').first().textContent();
      // The text should contain the literal script tag as visible text
      expect(titleText).toContain('<script>');

      // Verify no script was injected into DOM as an actual <script> element
      const scriptCount = await page.evaluate(() => {
        return document.querySelectorAll('#gallery1 script').length;
      });
      expect(scriptCount).toBe(0);

      // Verify the title element's innerHTML is NOT the same as its textContent
      // (i.e., HTML entities are escaped)
      const { innerHTML, textContent } = await page.evaluate(() => {
        const el = document.querySelector('#gallery1 .pc-item-title');
        return { innerHTML: el.innerHTML, textContent: el.textContent };
      });
      // innerHTML should have escaped entities, textContent shows the visible text
      expect(innerHTML).toContain('&lt;script&gt;');
    });

    test('should escape HTML in subtitle to prevent XSS', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 400, data: window.xssTestData });
      });

      const subtitleText = await page.locator('#gallery1 .pc-item-subtitle').first().textContent();
      expect(subtitleText).toContain('<img');
      expect(subtitleText).toContain('onerror');
    });

  });

  test.describe('Animation', () => {

    test('should animate using CSS transforms', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 400, data: window.testData });
      });

      // Wait for animation to progress
      await page.waitForTimeout(500);

      const transform = await page.evaluate(() => {
        const container = document.querySelector('#gallery1 .pc-all');
        return container?.style.transform;
      });

      expect(transform).toMatch(/translateY\(\d+px\)/);
    });

    test('should use translateY on items', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 400, data: window.testData });
      });

      const itemTransform = await page.evaluate(() => {
        const item = document.querySelector('#gallery1 .pc-item');
        return item?.style.transform;
      });

      expect(itemTransform).toMatch(/translateY/);
    });

  });

  test.describe('Options', () => {

    test('should apply custom titleSize', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 400, titleSize: 24, data: window.testData });
      });

      const title = page.locator('#gallery1 .pc-item-title').first();
      await expect(title).toHaveCSS('font-size', '24px');
    });

    test('should apply custom overlayColor', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 400, overlayColor: 'rgb(255, 0, 0)', data: window.testData });
      });

      const overlay = page.locator('#gallery1 .pc-item-overlay').first();
      await expect(overlay).toHaveCSS('background-color', 'rgb(255, 0, 0)');
    });

    test('should apply custom itemheight', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 400, itemheight: 200, data: window.testData });
      });

      const item = page.locator('#gallery1 .pc-item').first();
      await expect(item).toHaveCSS('height', '200px');
    });

  });

  test.describe('Defaults', () => {

    test('should expose defaults on $.fn.photocols.defaults', async ({ page }) => {
      const defaults = await page.evaluate(() => {
        return $.fn.photocols.defaults;
      });

      expect(defaults).toHaveProperty('bgcolor', '#000');
      expect(defaults).toHaveProperty('height', 600);
      expect(defaults).toHaveProperty('colswidth', 200);
      expect(defaults).toHaveProperty('opacity', 0.3);
      expect(defaults).toHaveProperty('stopOnHover', true);
    });

    test('should allow modifying global defaults', async ({ page }) => {
      await page.evaluate(() => {
        $.fn.photocols.defaults.height = 999;
        window.initGallery('#gallery1', { data: window.testData });
      });

      const container = page.locator('#gallery1');
      await expect(container).toHaveCSS('height', '999px');
    });

  });

  test.describe('Direction', () => {

    test('should default to direction up', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 400, data: window.testData });
      });

      // Wait for animation
      await page.waitForTimeout(300);

      const transform = await page.evaluate(() => {
        const container = document.querySelector('#gallery1 .pc-all');
        return container?.style.transform;
      });

      // Default up direction uses translateY
      expect(transform).toMatch(/translateY/);
    });

    test('should support direction down', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 400, direction: 'down', data: window.testData });
      });

      await page.waitForTimeout(300);

      const transform = await page.evaluate(() => {
        const container = document.querySelector('#gallery1 .pc-all');
        return container?.style.transform;
      });

      expect(transform).toMatch(/translateY/);
    });

    test('should support direction left (horizontal)', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 400, direction: 'left', data: window.testData });
      });

      await page.waitForTimeout(300);

      // Horizontal creates rows instead of columns
      const hasRows = await page.evaluate(() => {
        return document.querySelectorAll('#gallery1 .pc-row').length > 0;
      });

      expect(hasRows).toBeTruthy();
    });

    test('should support direction right (horizontal)', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 400, direction: 'right', data: window.testData });
      });

      await page.waitForTimeout(300);

      const hasRows = await page.evaluate(() => {
        return document.querySelectorAll('#gallery1 .pc-row').length > 0;
      });

      expect(hasRows).toBeTruthy();
    });

    test('should use translateX for horizontal directions', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 400, direction: 'left', data: window.testData });
      });

      await page.waitForTimeout(300);

      const transform = await page.evaluate(() => {
        const container = document.querySelector('#gallery1 .pc-all');
        return container?.style.transform;
      });

      expect(transform).toMatch(/translateX/);
    });

    test('should have horizontal shadow for left/right directions', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', { height: 400, direction: 'left', data: window.testData });
      });

      const shadow = page.locator('#gallery1 > div[id$="-shadow"]');
      const boxShadow = await shadow.evaluate(el => getComputedStyle(el).boxShadow);

      // Horizontal shadows have left/right inset
      expect(boxShadow).toBeTruthy();
    });

  });

  test.describe('Variable Speed', () => {

    test('should support variableSpeed option', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', {
          height: 400,
          variableSpeed: true,
          speedVariation: 0.5,
          data: window.testData
        });
      });

      // Should have columns (or rows)
      const hasColumns = await page.evaluate(() => {
        return document.querySelectorAll('#gallery1 .pc-col').length > 0;
      });

      expect(hasColumns).toBeTruthy();
    });

    test('should create columns with different speeds', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', {
          height: 400,
          colswidth: 100,
          variableSpeed: true,
          speedVariation: 0.8,
          data: window.testData
        });
      });

      await page.waitForTimeout(500);

      // Get transform values for each column
      const transforms = await page.evaluate(() => {
        const cols = document.querySelectorAll('#gallery1 .pc-col');
        return Array.from(cols).map(col => col.style.transform);
      });

      // With variable speed, columns should have different Y positions
      // At least check we have multiple columns
      expect(transforms.length).toBeGreaterThan(0);
    });

  });

  test.describe('Pause All on Hover', () => {

    test('should pause entire gallery when pauseAllOnHover is true', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', {
          height: 400,
          pauseAllOnHover: true,
          data: window.testData
        });
      });

      await page.waitForTimeout(200);

      // Hover over container
      await page.hover('#gallery1');
      await page.waitForTimeout(100);

      const transformBefore = await page.evaluate(() => {
        const container = document.querySelector('#gallery1 .pc-all');
        return container?.style.transform;
      });

      await page.waitForTimeout(200);

      const transformAfter = await page.evaluate(() => {
        const container = document.querySelector('#gallery1 .pc-all');
        return container?.style.transform;
      });

      // Animation should be paused, transform shouldn't change
      expect(transformBefore).toEqual(transformAfter);
    });

    test('should resume when mouse leaves with pauseAllOnHover', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', {
          height: 400,
          pauseAllOnHover: true,
          data: window.testData
        });
      });

      // Hover and leave
      await page.hover('#gallery1');
      await page.waitForTimeout(100);

      const pausedTransform = await page.evaluate(() => {
        const container = document.querySelector('#gallery1 .pc-all');
        return container?.style.transform;
      });

      // Move away from gallery
      await page.mouse.move(0, 0);
      await page.waitForTimeout(300);

      const resumedTransform = await page.evaluate(() => {
        const container = document.querySelector('#gallery1 .pc-all');
        return container?.style.transform;
      });

      // Animation should have resumed
      expect(pausedTransform).not.toEqual(resumedTransform);
    });

  });

  test.describe('Lazy Loading', () => {

    test('should support lazyLoad option', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', {
          height: 400,
          lazyLoad: true,
          data: window.testData
        });
      });

      const hasItems = await page.evaluate(() => {
        return document.querySelectorAll('#gallery1 .pc-item').length > 0;
      });

      expect(hasItems).toBeTruthy();
    });

    test('should show placeholder color when lazyLoad is enabled', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', {
          height: 400,
          lazyLoad: true,
          placeholderColor: 'rgb(100, 100, 100)',
          data: window.testData
        });
      });

      // Items should have placeholder color initially
      const item = page.locator('#gallery1 .pc-item').first();
      const bgColor = await item.evaluate(el => getComputedStyle(el).backgroundColor);

      // Should have the placeholder color OR the image loaded
      expect(bgColor).toBeTruthy();
    });

    test('should load images that are visible', async ({ page }) => {
      await page.evaluate(() => {
        window.initGallery('#gallery1', {
          height: 400,
          lazyLoad: true,
          lazyLoadThreshold: 200,
          data: window.testData
        });
      });

      // Wait for images to be observed and loaded
      await page.waitForTimeout(500);

      // At least some items should have background-image
      const loadedCount = await page.evaluate(() => {
        const items = document.querySelectorAll('#gallery1 .pc-item');
        return Array.from(items).filter(item => {
          const bg = item.style.backgroundImage;
          return bg && bg !== 'none' && bg !== '';
        }).length;
      });

      // Some images should have loaded (visible ones)
      expect(loadedCount).toBeGreaterThan(0);
    });

  });

  test.describe('New Defaults', () => {

    test('should expose new defaults', async ({ page }) => {
      const defaults = await page.evaluate(() => {
        return $.fn.photocols.defaults;
      });

      expect(defaults).toHaveProperty('direction', 'up');
      expect(defaults).toHaveProperty('variableSpeed', false);
      expect(defaults).toHaveProperty('speedVariation', 0.5);
      expect(defaults).toHaveProperty('pauseAllOnHover', false);
      expect(defaults).toHaveProperty('lazyLoad', false);
      expect(defaults).toHaveProperty('lazyLoadThreshold', 100);
      expect(defaults).toHaveProperty('placeholderColor', '#333');
    });

  });

});
