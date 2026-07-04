namespace AutoGestPro.Contracts.Citas;

public sealed record CitaListItemDto(
    int IdCita,
    int IdCliente,
    int? IdVehiculo,
    string Cliente,
    string Estado,
    string Tipo,
    DateTime FechaHoraCita,
    string MotivoConsulta);

public sealed record CitaDetailDto(
    int IdCita,
    int IdCliente,
    int? IdVehiculo,
    int IdEstadoCita,
    int IdTipoCita,
    int? IdUsuarioAsignado,
    DateTime FechaHoraCita,
    int? DuracionEstimadaMin,
    string MotivoConsulta,
    string? Observaciones,
    DateTime FechaCreacion);

public sealed record CreateCitaRequest(
    int IdCliente,
    int? IdVehiculo,
    int IdEstadoCita,
    int IdTipoCita,
    int? IdUsuarioAsignado,
    DateTime FechaHoraCita,
    int? DuracionEstimadaMin,
    string MotivoConsulta,
    string? Observaciones,
    int IdUsuarioCreacion);

public sealed record UpdateCitaRequest(
    int? IdVehiculo,
    int IdEstadoCita,
    int IdTipoCita,
    int? IdUsuarioAsignado,
    DateTime FechaHoraCita,
    int? DuracionEstimadaMin,
    string MotivoConsulta,
    string? Observaciones);

public sealed record CambiarEstadoCitaRequest(
    int IdEstadoCita,
    string? MotivoCancelacion);
