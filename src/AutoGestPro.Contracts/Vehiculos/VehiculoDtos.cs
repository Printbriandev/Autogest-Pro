namespace AutoGestPro.Contracts.Vehiculos;

public sealed record VehiculoListItemDto(
    int IdVehiculo,
    int IdCliente,
    string Cliente,
    string Marca,
    string Modelo,
    short Anio,
    string NumeroPlaca,
    int KilometrajeActual,
    bool Activo);

public sealed record VehiculoDetailDto(
    int IdVehiculo,
    int IdCliente,
    int IdMarca,
    int IdModelo,
    int IdColor,
    int IdTipoVehiculo,
    short Anio,
    string NumeroPlaca,
    string? NumeroChasis,
    string? NumeroMotor,
    decimal? Cilindraje,
    string TipoCombustible,
    string Transmision,
    int KilometrajeActual,
    string? Observaciones,
    bool Activo);

public sealed record CreateVehiculoRequest(
    int IdCliente,
    int IdMarca,
    int IdModelo,
    int IdColor,
    int IdTipoVehiculo,
    short Anio,
    string NumeroPlaca,
    string? NumeroChasis,
    string? NumeroMotor,
    decimal? Cilindraje,
    string TipoCombustible,
    string Transmision,
    int KilometrajeActual,
    string? Observaciones);

public sealed record UpdateVehiculoRequest(
    int IdMarca,
    int IdModelo,
    int IdColor,
    int IdTipoVehiculo,
    short Anio,
    string NumeroPlaca,
    string? NumeroChasis,
    string? NumeroMotor,
    decimal? Cilindraje,
    string TipoCombustible,
    string Transmision,
    int KilometrajeActual,
    string? Observaciones,
    bool Activo);
