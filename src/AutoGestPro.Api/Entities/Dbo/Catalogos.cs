using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoGestPro.Api.Entities.Dbo;

[Table("CustomerType", Schema = "dbo")]
public sealed class TipoCliente
{
    [Key]
    public int IdTipoCliente { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
}

[Table("VehicleBrand", Schema = "dbo")]
public sealed class MarcaVehiculo
{
    [Key]
    public int IdMarca { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? PaisOrigen { get; set; }
    public bool Activo { get; set; } = true;
}

[Table("VehicleModel", Schema = "dbo")]
public sealed class ModeloVehiculo
{
    [Key]
    public int IdModelo { get; set; }
    public int IdMarca { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
}

[Table("VehicleType", Schema = "dbo")]
public sealed class TipoVehiculo
{
    [Key]
    public int IdTipoVehiculo { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
}

[Table("Color", Schema = "dbo")]
public sealed class Color
{
    [Key]
    public int IdColor { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? CodigoHex { get; set; }
}

[Table("AppointmentType", Schema = "dbo")]
public sealed class TipoCita
{
    [Key]
    public int IdTipoCita { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
}

[Table("AppointmentStatus", Schema = "dbo")]
public sealed class EstadoCita
{
    [Key]
    public int IdEstadoCita { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public bool Activo { get; set; } = true;
}

[Table("ServiceCategory", Schema = "dbo")]
public sealed class CategoriaServicio
{
    [Key]
    public int IdCategoriaServicio { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
}

[Table("Service", Schema = "dbo")]
public sealed class Servicio
{
    [Key]
    public int IdServicio { get; set; }
    public int IdCategoriaServicio { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public decimal PrecioBase { get; set; }
    public int? DuracionEstimadaMin { get; set; }
    public bool Activo { get; set; } = true;
}

[Table("SparePartCategory", Schema = "dbo")]
public sealed class CategoriaRepuesto
{
    [Key]
    public int IdCategoriaRepuesto { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
}

[Table("SparePart", Schema = "dbo")]
public sealed class Repuesto
{
    [Key]
    public int IdRepuesto { get; set; }
    public int IdCategoriaRepuesto { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string? CodigoFabricante { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public string UnidadMedida { get; set; } = string.Empty;
    public decimal StockActual { get; set; }
    public decimal StockMinimo { get; set; }
    public decimal PrecioCompra { get; set; }
    public decimal PrecioVenta { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime FechaCreacion { get; set; } = DateTime.Now;
}

[Table("ServiceOrderStatus", Schema = "dbo")]
public sealed class EstadoOrden
{
    [Key]
    public int IdEstadoOrden { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public bool EsFinal { get; set; }
    public bool Activo { get; set; } = true;
}

[Table("InvoiceStatus", Schema = "dbo")]
public sealed class EstadoFactura
{
    [Key]
    public int IdEstadoFactura { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
}

[Table("PaymentMethod", Schema = "dbo")]
public sealed class MetodoPago
{
    [Key]
    public int IdMetodoPago { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
}

[Table("NCFType", Schema = "dbo")]
public sealed class TipoNcf
{
    [Key]
    public int IdTipoNCF { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
}
