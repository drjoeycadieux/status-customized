/**
 * Theme management utility for dark/light mode
 */
export class ThemeManager {
  private currentTheme: 'light' | 'dark' | 'auto' = 'auto';
  private toggleButton: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  /**
   * Initialize theme manager
   */
  private init(): void {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto';
    this.currentTheme = savedTheme || 'auto';
    
    // Apply initial theme
    this.applyTheme();
    
    // Create theme toggle button
    this.createToggleButton();
    
    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        if (this.currentTheme === 'auto') {
          this.applyTheme();
        }
      });
    }
  }

  /**
   * Create theme toggle button
   */
  private createToggleButton(): void {
    this.toggleButton = document.createElement('button');
    this.toggleButton.className = 'theme-toggle';
    this.toggleButton.setAttribute('aria-label', 'Toggle theme');
    this.toggleButton.setAttribute('title', 'Toggle theme');
    
    this.updateToggleButton();
    
    this.toggleButton.addEventListener('click', () => {
      this.toggleTheme();
    });
    
    document.body.appendChild(this.toggleButton);
  }

  /**
   * Update toggle button icon
   */
  private updateToggleButton(): void {
    if (!this.toggleButton) return;
    
    const effectiveTheme = this.getEffectiveTheme();
    
    switch (effectiveTheme) {
      case 'dark':
        this.toggleButton.innerHTML = '🌙';
        this.toggleButton.title = 'Switch to light theme';
        break;
      case 'light':
        this.toggleButton.innerHTML = '☀️';
        this.toggleButton.title = 'Switch to dark theme';
        break;
    }
  }

  /**
   * Toggle between themes
   */
  public toggleTheme(): void {
    switch (this.currentTheme) {
      case 'auto':
        // Auto -> Light
        this.setTheme('light');
        break;
      case 'light':
        // Light -> Dark
        this.setTheme('dark');
        break;
      case 'dark':
        // Dark -> Auto
        this.setTheme('auto');
        break;
    }
  }

  /**
   * Set theme explicitly
   */
  public setTheme(theme: 'light' | 'dark' | 'auto'): void {
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme();
    this.updateToggleButton();
  }

  /**
   * Apply the current theme to the document
   */
  private applyTheme(): void {
    const effectiveTheme = this.getEffectiveTheme();
    
    // Remove existing theme attributes
    document.documentElement.removeAttribute('data-theme');
    
    // Apply new theme
    if (this.currentTheme !== 'auto') {
      document.documentElement.setAttribute('data-theme', effectiveTheme);
    }
    
    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(effectiveTheme);
  }

  /**
   * Get the effective theme (resolves 'auto' to actual theme)
   */
  private getEffectiveTheme(): 'light' | 'dark' {
    if (this.currentTheme === 'auto') {
      // Use system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    }
    return this.currentTheme;
  }

  /**
   * Update meta theme-color for mobile browsers
   */
  private updateMetaThemeColor(theme: 'light' | 'dark'): void {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    
    const themeColor = theme === 'dark' ? '#0f172a' : '#ffffff';
    metaThemeColor.setAttribute('content', themeColor);
  }

  /**
   * Get current theme
   */
  public getCurrentTheme(): 'light' | 'dark' | 'auto' {
    return this.currentTheme;
  }

  /**
   * Check if dark theme is currently active
   */
  public isDarkTheme(): boolean {
    return this.getEffectiveTheme() === 'dark';
  }
}
