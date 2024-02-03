export interface ISettingsState {
  openCount: number;
  language: string;
  navButton: boolean;
  darkTheme: boolean;
  fontSize: number;
  isRated: boolean;
  visibleProgress: boolean;
  restoreProgress: boolean;
  restoreState: boolean;
}

export const initialSettingsState: ISettingsState = {
  openCount: 0,
  language: '',
  navButton: true,
  darkTheme: false,
  fontSize: 1.0,
  isRated: false,
  visibleProgress: true,
  restoreProgress: true,
  restoreState: true,
};
