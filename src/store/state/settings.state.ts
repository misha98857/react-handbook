export interface SettingsState {
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
  language: '',
  navButton: true,
  darkTheme: false,
  fontSize: 1.0,
  isRated: false,
  showProgress: true,
  restoreProgress: true,
  restoreState: true,
};
