using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoGestPro.Api.Entities.Seg;

[Table("Role", Schema = "sec")]
public sealed class Rol
{
    [Key]
    public int IdRol { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public bool Activo { get; set; } = true;
}

[Table("User", Schema = "sec")]
public sealed class Usuario
{
    [Key]
    public int IdUsuario { get; set; }
    public int IdRol { get; set; }
    public string Nombres { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;
    public string NombreUsuario { get; set; } = string.Empty;
    public string CorreoElectronico { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public string? FotoUrl { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime FechaCreacion { get; set; } = DateTime.Now;
    public DateTime? FechaModificacion { get; set; }
    public int? IdUsuarioCreacion { get; set; }
}

[Table("Credential", Schema = "sec")]
public sealed class Credencial
{
    [Key]
    public int IdCredencial { get; set; }
    public int IdUsuario { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime FechaUltimoCambio { get; set; } = DateTime.Now;
    public bool DebeCambiarPassword { get; set; }
    public DateOnly? FechaExpiracion { get; set; }
}

[Table("UserSession", Schema = "sec")]
public sealed class SesionUsuario
{
    [Key]
    public int IdSesion { get; set; }
    public int IdUsuario { get; set; }
    public Guid Token { get; set; } = Guid.NewGuid();
    public string DireccionIP { get; set; } = string.Empty;
    public string? UserAgent { get; set; }
    public DateTime FechaInicio { get; set; } = DateTime.Now;
    public DateTime FechaExpiracion { get; set; }
    public DateTime? FechaCierre { get; set; }
    public bool Activa { get; set; } = true;
}
