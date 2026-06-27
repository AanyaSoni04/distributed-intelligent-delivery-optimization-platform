export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export const success = <T>(
  message: string,
  data?: T
): ApiResponse<T> => {
  return {
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
  };
};

export const error = (
  message: string,
  extra: Record<string, any> = {}
): ApiResponse<null> & Record<string, any> => {
  return {
    success: false,
    message,
    ...extra,
  };
};
