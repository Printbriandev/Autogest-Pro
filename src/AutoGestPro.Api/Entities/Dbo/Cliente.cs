using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoGestPro.Api.Entities.Dbo;

[Table("Customer", Schema = "dbo")]
public sealed class Cliente
{
    [Key]
    public int IdCliente { get; set; }
    public int IdTipoCliente { get; set; }
    public string Nombres { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;
    public string? RazonSocial { get; set; }
    public string TipoDocumento { get; set; } = string.Empty;
    public string NumeroDocumento { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string? TelefonoAlternativo { get; set; }
    public string? CorreoElectronico { get; set; }
    public int? IdDireccion { get; set; }
    public DateOnly? FechaNacimiento { get; set; }
    public string? Genero { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime FechaCreacion { get; set; } = DateTime.Now;
    public DateTime? FechaModificacion { get; set; }
}
