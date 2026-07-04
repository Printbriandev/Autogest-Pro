namespace AutoGestPro.Contracts.Catalogos;

public sealed record CatalogoItemDto(
    int Id,
    string Nombre,
    string? Descripcion = null);
