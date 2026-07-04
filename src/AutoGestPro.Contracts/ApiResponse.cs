namespace AutoGestPro.Contracts;

public sealed class ApiResponse<T>
{
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
    public T? Data { get; init; }
    public string[]? Errors { get; init; }

    public static ApiResponse<T> Ok(T? data, string message = "Exitoso") => new()
    {
        Success = true,
        Message = message,
        Data = data
    };

    public static ApiResponse<T> Fail(string message, string[]? errors = null) => new()
    {
        Success = false,
        Message = message,
        Data = default,
        Errors = errors
    };
}
