export interface SettingsState {
  openCount: number;
  language: string;
  navButton: boolean;
  darkTheme: boolean;
  fontSize: number;
  isRated: boolean;
  showProgress: boolean;
  restoreProgress: boolean;
  restoreState: boolean;
}

export const initialSettingsState: SettingsState = {
  openCount: 0,
  language: '',
  navButton: true,
  darkTheme: false,
  fontSize: 1.0,
  isRated: false,
  showProgress: true,
  restoreProgress: true,
  restoreState: true,
};
