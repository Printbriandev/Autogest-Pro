using AutoGestPro.Api.Entities.Dbo;
using AutoGestPro.Api.Entities.Seg;
using Microsoft.EntityFrameworkCore;

namespace AutoGestPro.Api.Data;

public sealed class AutoGestProDbContext(DbContextOptions<AutoGestProDbContext> options)
    : DbContext(options)
{
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Vehiculo> Vehiculos => Set<Vehiculo>();
    public DbSet<Cita> Citas => Set<Cita>();
    public DbSet<OrdenServicio> OrdenesServicio => Set<OrdenServicio>();
    public DbSet<Factura> Facturas => Set<Factura>();
    public DbSet<Pago> Pagos => Set<Pago>();

    public DbSet<TipoCliente> TiposCliente => Set<TipoCliente>();
    public DbSet<MarcaVehiculo> MarcasVehiculo => Set<MarcaVehiculo>();
    public DbSet<ModeloVehiculo> ModelosVehiculo => Set<ModeloVehiculo>();
    public DbSet<TipoVehiculo> TiposVehiculo => Set<TipoVehiculo>();
    public DbSet<Color> Colores => Set<Color>();
    public DbSet<TipoCita> TiposCita => Set<TipoCita>();
    public DbSet<EstadoCita> EstadosCita => Set<EstadoCita>();
    public DbSet<CategoriaServicio> CategoriasServicio => Set<CategoriaServicio>();
    public DbSet<Servicio> Servicios => Set<Servicio>();
    public DbSet<CategoriaRepuesto> CategoriasRepuesto => Set<CategoriaRepuesto>();
    public DbSet<Repuesto> Repuestos => Set<Repuesto>();
    public DbSet<EstadoOrden> EstadosOrden => Set<EstadoOrden>();
    public DbSet<EstadoFactura> EstadosFactura => Set<EstadoFactura>();
    public DbSet<MetodoPago> MetodosPago => Set<MetodoPago>();
    public DbSet<TipoNcf> TiposNcf => Set<TipoNcf>();

    public DbSet<Rol> Roles => Set<Rol>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Credencial> Credenciales => Set<Credencial>();
    public DbSet<SesionUsuario> SesionesUsuario => Set<SesionUsuario>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("dbo");

        ConfigureCliente(modelBuilder);
        ConfigureVehiculo(modelBuilder);
        ConfigureCita(modelBuilder);
        ConfigureOrdenServicio(modelBuilder);
        ConfigureFacturacion(modelBuilder);
        ConfigureCatalogos(modelBuilder);
        ConfigureSeguridad(modelBuilder);
    }

    private static void ConfigureCliente(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.ToTable("Customer", "dbo");
            entity.HasKey(x => x.IdCliente);
            entity.Property(x => x.IdCliente).HasColumnName("IdCustomer");
            entity.Property(x => x.IdTipoCliente).HasColumnName("IdCustomerType");
            entity.Property(x => x.Nombres).HasColumnName("FirstName").HasMaxLength(100);
            entity.Property(x => x.Apellidos).HasColumnName("LastName").HasMaxLength(100);
            entity.Property(x => x.RazonSocial).HasColumnName("CompanyName").HasMaxLength(200);
            entity.Property(x => x.TipoDocumento).HasColumnName("DocumentType").HasMaxLength(3).IsFixedLength();
            entity.Property(x => x.NumeroDocumento).HasColumnName("DocumentNumber").HasMaxLength(20);
            entity.Property(x => x.Telefono).HasColumnName("Phone").HasMaxLength(20);
            entity.Property(x => x.TelefonoAlternativo).HasColumnName("AlternativePhone").HasMaxLength(20);
            entity.Property(x => x.CorreoElectronico).HasColumnName("Email").HasMaxLength(150);
            entity.Property(x => x.IdDireccion).HasColumnName("IdAddress");
            entity.Property(x => x.FechaNacimiento).HasColumnName("DateOfBirth");
            entity.Property(x => x.Genero).HasColumnName("Gender").HasMaxLength(1).IsFixedLength();
            entity.Property(x => x.Activo).HasColumnName("IsActive");
            entity.Property(x => x.FechaCreacion).HasColumnName("CreatedDate");
            entity.Property(x => x.FechaModificacion).HasColumnName("ModifiedDate");
        });
    }

    private static void ConfigureVehiculo(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Vehiculo>(entity =>
        {
            entity.ToTable("Vehicle", "dbo");
            entity.HasKey(x => x.IdVehiculo);
            entity.Property(x => x.IdVehiculo).HasColumnName("IdVehicle");
            entity.Property(x => x.IdCliente).HasColumnName("IdCustomer");
            entity.Property(x => x.IdMarca).HasColumnName("IdBrand");
            entity.Property(x => x.IdModelo).HasColumnName("IdModel");
            entity.Property(x => x.IdColor).HasColumnName("IdColor");
            entity.Property(x => x.IdTipoVehiculo).HasColumnName("IdVehicleType");
            entity.Property(x => x.Anio).HasColumnName("ModelYear");
            entity.Property(x => x.NumeroPlaca).HasColumnName("LicensePlate").HasMaxLength(20);
            entity.Property(x => x.NumeroChasis).HasColumnName("ChassisNumber").HasMaxLength(50);
            entity.Property(x => x.NumeroMotor).HasColumnName("EngineNumber").HasMaxLength(50);
            entity.Property(x => x.Cilindraje).HasColumnName("EngineDisplacement").HasPrecision(4, 1);
            entity.Property(x => x.TipoCombustible).HasColumnName("FuelType").HasMaxLength(20);
            entity.Property(x => x.Transmision).HasColumnName("Transmission").HasMaxLength(20);
            entity.Property(x => x.KilometrajeActual).HasColumnName("CurrentMileage");
            entity.Property(x => x.FotoUrl).HasColumnName("PhotoUrl").HasMaxLength(500);
            entity.Property(x => x.Observaciones).HasColumnName("Notes").HasMaxLength(500);
            entity.Property(x => x.Activo).HasColumnName("IsActive");
            entity.Property(x => x.FechaCreacion).HasColumnName("CreatedDate");
            entity.Property(x => x.FechaModificacion).HasColumnName("ModifiedDate");
        });
    }

    private static void ConfigureCita(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cita>(entity =>
        {
            entity.ToTable("Appointment", "dbo");
            entity.HasKey(x => x.IdCita);
            entity.Property(x => x.IdCita).HasColumnName("IdAppointment");
            entity.Property(x => x.IdCliente).HasColumnName("IdCustomer");
            entity.Property(x => x.IdVehiculo).HasColumnName("IdVehicle");
            entity.Property(x => x.IdEstadoCita).HasColumnName("IdAppointmentStatus");
            entity.Property(x => x.IdTipoCita).HasColumnName("IdAppointmentType");
            entity.Property(x => x.IdUsuarioAsignado).HasColumnName("IdAssignedUser");
            entity.Property(x => x.FechaHoraCita).HasColumnName("AppointmentDateTime");
            entity.Property(x => x.DuracionEstimadaMin).HasColumnName("EstimatedDurationMinutes");
            entity.Property(x => x.MotivoConsulta).HasColumnName("ReasonForVisit").HasMaxLength(500);
            entity.Property(x => x.Observaciones).HasColumnName("Notes").HasMaxLength(500);
            entity.Property(x => x.FechaConfirmacion).HasColumnName("ConfirmationDate");
            entity.Property(x => x.FechaCancelacion).HasColumnName("CancellationDate");
            entity.Property(x => x.MotivoCancelacion).HasColumnName("CancellationReason").HasMaxLength(300);
            entity.Property(x => x.FechaCreacion).HasColumnName("CreatedDate");
            entity.Property(x => x.FechaModificacion).HasColumnName("ModifiedDate");
            entity.Property(x => x.IdUsuarioCreacion).HasColumnName("CreatedByUserId");
        });
    }

    private static void ConfigureOrdenServicio(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OrdenServicio>(entity =>
        {
            entity.ToTable("ServiceOrder", "dbo");
            entity.HasKey(x => x.IdOrdenServicio);
            entity.Property(x => x.IdOrdenServicio).HasColumnName("IdServiceOrder");
            entity.Property(x => x.NumeroOrden).HasColumnName("OrderNumber").HasMaxLength(20);
            entity.Property(x => x.IdCliente).HasColumnName("IdCustomer");
            entity.Property(x => x.IdVehiculo).HasColumnName("IdVehicle");
            entity.Property(x => x.IdCita).HasColumnName("IdAppointment");
            entity.Property(x => x.IdEstadoOrden).HasColumnName("IdServiceOrderStatus");
            entity.Property(x => x.IdUsuarioAsesor).HasColumnName("IdAdvisorUser");
            entity.Property(x => x.IdUsuarioMecanico).HasColumnName("IdMechanicUser");
            entity.Property(x => x.KilometrajeEntrada).HasColumnName("EntryMileage");
            entity.Property(x => x.KilometrajeSalida).HasColumnName("ExitMileage");
            entity.Property(x => x.FechaIngreso).HasColumnName("EntryDate");
            entity.Property(x => x.FechaPrometida).HasColumnName("PromisedDate");
            entity.Property(x => x.FechaEntrega).HasColumnName("DeliveryDate");
            entity.Property(x => x.SintomasReportados).HasColumnName("ReportedSymptoms").HasMaxLength(1000);
            entity.Property(x => x.DiagnosticoTecnico).HasColumnName("TechnicalDiagnosis").HasMaxLength(1000);
            entity.Property(x => x.TrabajoRealizado).HasColumnName("WorkPerformed").HasMaxLength(2000);
            entity.Property(x => x.Observaciones).HasColumnName("Notes").HasMaxLength(500);
            entity.Property(x => x.SubTotal).HasColumnName("SubTotal").HasPrecision(18, 2);
            entity.Property(x => x.PorcentajeDescuento).HasColumnName("DiscountPercentage").HasPrecision(5, 2);
            entity.Property(x => x.MontoDescuento).HasColumnName("DiscountAmount").HasPrecision(18, 2);
            entity.Property(x => x.PorcentajeImpuesto).HasColumnName("TaxPercentage").HasPrecision(5, 2);
            entity.Property(x => x.MontoImpuesto).HasColumnName("TaxAmount").HasPrecision(18, 2);
            entity.Property(x => x.Total).HasColumnName("Total").HasPrecision(18, 2);
            entity.Property(x => x.FechaCreacion).HasColumnName("CreatedDate");
            entity.Property(x => x.FechaModificacion).HasColumnName("ModifiedDate");
            entity.Property(x => x.IdUsuarioCreacion).HasColumnName("CreatedByUserId");
        });
    }

    private static void ConfigureFacturacion(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Factura>(entity =>
        {
            entity.ToTable("Invoice", "dbo");
            entity.HasKey(x => x.IdFactura);
            entity.Property(x => x.IdFactura).HasColumnName("IdInvoice");
            entity.Property(x => x.NumeroFactura).HasColumnName("InvoiceNumber").HasMaxLength(20);
            entity.Property(x => x.NCF).HasColumnName("NCF").HasMaxLength(19);
            entity.Property(x => x.IdTipoNCF).HasColumnName("IdNCFType");
            entity.Property(x => x.IdCliente).HasColumnName("IdCustomer");
            entity.Property(x => x.IdOrdenServicio).HasColumnName("IdServiceOrder");
            entity.Property(x => x.IdEstadoFactura).HasColumnName("IdInvoiceStatus");
            entity.Property(x => x.IdMetodoPago).HasColumnName("IdPaymentMethod");
            entity.Property(x => x.FechaEmision).HasColumnName("IssueDate");
            entity.Property(x => x.FechaVencimiento).HasColumnName("DueDate");
            entity.Property(x => x.SubTotal).HasColumnName("SubTotal").HasPrecision(18, 2);
            entity.Property(x => x.MontoDescuento).HasColumnName("DiscountAmount").HasPrecision(18, 2);
            entity.Property(x => x.MontoImpuesto).HasColumnName("TaxAmount").HasPrecision(18, 2);
            entity.Property(x => x.Total).HasColumnName("Total").HasPrecision(18, 2);
            entity.Property(x => x.MontoPagado).HasColumnName("AmountPaid").HasPrecision(18, 2);
            entity.Property(x => x.SaldoPendiente).HasColumnName("BalanceDue").HasPrecision(18, 2);
            entity.Property(x => x.Notas).HasColumnName("Notes").HasMaxLength(500);
            entity.Property(x => x.FechaCreacion).HasColumnName("CreatedDate");
            entity.Property(x => x.IdUsuarioCreacion).HasColumnName("CreatedByUserId");
        });

        modelBuilder.Entity<Pago>(entity =>
        {
            entity.ToTable("Payment", "dbo");
            entity.HasKey(x => x.IdPago);
            entity.Property(x => x.IdPago).HasColumnName("IdPayment");
            entity.Property(x => x.IdFactura).HasColumnName("IdInvoice");
            entity.Property(x => x.IdMetodoPago).HasColumnName("IdPaymentMethod");
            entity.Property(x => x.MontoPagado).HasColumnName("AmountPaid").HasPrecision(18, 2);
            entity.Property(x => x.ReferenciaPago).HasColumnName("PaymentReference").HasMaxLength(100);
            entity.Property(x => x.FechaPago).HasColumnName("PaymentDate");
            entity.Property(x => x.IdUsuario).HasColumnName("IdUser");
            entity.Property(x => x.Observaciones).HasColumnName("Notes").HasMaxLength(300);
        });
    }

    private static void ConfigureCatalogos(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TipoCliente>(entity =>
        {
            entity.ToTable("CustomerType", "dbo");
            entity.HasKey(x => x.IdTipoCliente);
            entity.Property(x => x.IdTipoCliente).HasColumnName("IdCustomerType");
            entity.Property(x => x.Descripcion).HasColumnName("Description").HasMaxLength(50);
            entity.Property(x => x.Activo).HasColumnName("IsActive");
        });

        modelBuilder.Entity<MarcaVehiculo>(entity =>
        {
            entity.ToTable("VehicleBrand", "dbo");
            entity.HasKey(x => x.IdMarca);
            entity.Property(x => x.IdMarca).HasColumnName("IdBrand");
            entity.Property(x => x.Nombre).HasColumnName("Name").HasMaxLength(80);
            entity.Property(x => x.PaisOrigen).HasColumnName("CountryOfOrigin").HasMaxLength(50);
            entity.Property(x => x.Activo).HasColumnName("IsActive");
        });

        modelBuilder.Entity<ModeloVehiculo>(entity =>
        {
            entity.ToTable("VehicleModel", "dbo");
            entity.HasKey(x => x.IdModelo);
            entity.Property(x => x.IdModelo).HasColumnName("IdModel");
            entity.Property(x => x.IdMarca).HasColumnName("IdBrand");
            entity.Property(x => x.Nombre).HasColumnName("Name").HasMaxLength(80);
            entity.Property(x => x.Activo).HasColumnName("IsActive");
        });

        modelBuilder.Entity<TipoVehiculo>(entity =>
        {
            entity.ToTable("VehicleType", "dbo");
            entity.HasKey(x => x.IdTipoVehiculo);
            entity.Property(x => x.IdTipoVehiculo).HasColumnName("IdVehicleType");
            entity.Property(x => x.Descripcion).HasColumnName("Description").HasMaxLength(50);
            entity.Property(x => x.Activo).HasColumnName("IsActive");
        });

        modelBuilder.Entity<Color>(entity =>
        {
            entity.ToTable("Color", "dbo");
            entity.HasKey(x => x.IdColor);
            entity.Property(x => x.IdColor).HasColumnName("IdColor");
            entity.Property(x => x.Nombre).HasColumnName("Name").HasMaxLength(50);
            entity.Property(x => x.CodigoHex).HasColumnName("HexCode").HasMaxLength(7).IsFixedLength();
        });

        modelBuilder.Entity<TipoCita>(entity =>
        {
            entity.ToTable("AppointmentType", "dbo");
            entity.HasKey(x => x.IdTipoCita);
            entity.Property(x => x.IdTipoCita).HasColumnName("IdAppointmentType");
            entity.Property(x => x.Nombre).HasColumnName("Name").HasMaxLength(100);
            entity.Property(x => x.Activo).HasColumnName("IsActive");
        });

        modelBuilder.Entity<EstadoCita>(entity =>
        {
            entity.ToTable("AppointmentStatus", "dbo");
            entity.HasKey(x => x.IdEstadoCita);
            entity.Property(x => x.IdEstadoCita).HasColumnName("IdAppointmentStatus");
            entity.Property(x => x.Nombre).HasColumnName("Name").HasMaxLength(50);
            entity.Property(x => x.Descripcion).HasColumnName("Description").HasMaxLength(200);
            entity.Property(x => x.Activo).HasColumnName("IsActive");
        });

        modelBuilder.Entity<CategoriaServicio>(entity =>
        {
            entity.ToTable("ServiceCategory", "dbo");
            entity.HasKey(x => x.IdCategoriaServicio);
            entity.Property(x => x.IdCategoriaServicio).HasColumnName("IdServiceCategory");
            entity.Property(x => x.Nombre).HasColumnName("Name").HasMaxLength(100);
            entity.Property(x => x.Activo).HasColumnName("IsActive");
        });

        modelBuilder.Entity<Servicio>(entity =>
        {
            entity.ToTable("Service", "dbo");
            entity.HasKey(x => x.IdServicio);
            entity.Property(x => x.IdServicio).HasColumnName("IdService");
            entity.Property(x => x.IdCategoriaServicio).HasColumnName("IdServiceCategory");
            entity.Property(x => x.Codigo).HasColumnName("Code").HasMaxLength(20);
            entity.Property(x => x.Nombre).HasColumnName("Name").HasMaxLength(150);
            entity.Property(x => x.Descripcion).HasColumnName("Description").HasMaxLength(500);
            entity.Property(x => x.PrecioBase).HasColumnName("BasePrice").HasPrecision(18, 2);
            entity.Property(x => x.DuracionEstimadaMin).HasColumnName("EstimatedDurationMinutes");
            entity.Property(x => x.Activo).HasColumnName("IsActive");
        });

        modelBuilder.Entity<CategoriaRepuesto>(entity =>
        {
            entity.ToTable("SparePartCategory", "dbo");
            entity.HasKey(x => x.IdCategoriaRepuesto);
            entity.Property(x => x.IdCategoriaRepuesto).HasColumnName("IdSparePartCategory");
            entity.Property(x => x.Nombre).HasColumnName("Name").HasMaxLength(100);
            entity.Property(x => x.Activo).HasColumnName("IsActive");
        });

        modelBuilder.Entity<Repuesto>(entity =>
        {
            entity.ToTable("SparePart", "dbo");
            entity.HasKey(x => x.IdRepuesto);
            entity.Property(x => x.IdRepuesto).HasColumnName("IdSparePart");
            entity.Property(x => x.IdCategoriaRepuesto).HasColumnName("IdSparePartCategory");
            entity.Property(x => x.Codigo).HasColumnName("Code").HasMaxLength(30);
            entity.Property(x => x.CodigoFabricante).HasColumnName("ManufacturerCode").HasMaxLength(50);
            entity.Property(x => x.Nombre).HasColumnName("Name").HasMaxLength(200);
            entity.Property(x => x.Descripcion).HasColumnName("Description").HasMaxLength(500);
            entity.Property(x => x.UnidadMedida).HasColumnName("UnitOfMeasure").HasMaxLength(20);
            entity.Property(x => x.StockActual).HasColumnName("CurrentStock").HasPrecision(10, 2);
            entity.Property(x => x.StockMinimo).HasColumnName("MinimumStock").HasPrecision(10, 2);
            entity.Property(x => x.PrecioCompra).HasColumnName("PurchasePrice").HasPrecision(18, 2);
            entity.Property(x => x.PrecioVenta).HasColumnName("SalePrice").HasPrecision(18, 2);
            entity.Property(x => x.Activo).HasColumnName("IsActive");
            entity.Property(x => x.FechaCreacion).HasColumnName("CreatedDate");
        });

        modelBuilder.Entity<EstadoOrden>(entity =>
        {
            entity.ToTable("ServiceOrderStatus", "dbo");
            entity.HasKey(x => x.IdEstadoOrden);
            entity.Property(x => x.IdEstadoOrden).HasColumnName("IdServiceOrderStatus");
            entity.Property(x => x.Nombre).HasColumnName("Name").HasMaxLength(50);
            entity.Property(x => x.EsFinal).HasColumnName("IsFinal");
            entity.Property(x => x.Activo).HasColumnName("IsActive");
        });

        modelBuilder.Entity<EstadoFactura>(entity =>
        {
            entity.ToTable("InvoiceStatus", "dbo");
            entity.HasKey(x => x.IdEstadoFactura);
            entity.Property(x => x.IdEstadoFactura).HasColumnName("IdInvoiceStatus");
            entity.Property(x => x.Nombre).HasColumnName("Name").HasMaxLength(50);
            entity.Property(x => x.Activo).HasColumnName("IsActive");
        });

        modelBuilder.Entity<MetodoPago>(entity =>
        {
            entity.ToTable("PaymentMethod", "dbo");
            entity.HasKey(x => x.IdMetodoPago);
            entity.Property(x => x.IdMetodoPago).HasColumnName("IdPaymentMethod");
            entity.Property(x => x.Nombre).HasColumnName("Name").HasMaxLength(50);
            entity.Property(x => x.Activo).HasColumnName("IsActive");
        });

        modelBuilder.Entity<TipoNcf>(entity =>
        {
            entity.ToTable("NCFType", "dbo");
            entity.HasKey(x => x.IdTipoNCF);
            entity.Property(x => x.IdTipoNCF).HasColumnName("IdNCFType");
            entity.Property(x => x.Codigo).HasColumnName("Code").HasMaxLength(3).IsFixedLength();
            entity.Property(x => x.Descripcion).HasColumnName("Description").HasMaxLength(100);
            entity.Property(x => x.Activo).HasColumnName("IsActive");
        });
    }

    private static void ConfigureSeguridad(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Rol>(entity =>
        {
            entity.ToTable("Role", "sec");
            entity.HasKey(x => x.IdRol);
            entity.Property(x => x.IdRol).HasColumnName("IdRole");
            entity.Property(x => x.Nombre).HasColumnName("Name").HasMaxLength(50);
            entity.Property(x => x.Descripcion).HasColumnName("Description").HasMaxLength(200);
            entity.Property(x => x.Activo).HasColumnName("IsActive");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("User", "sec");
            entity.HasKey(x => x.IdUsuario);
            entity.Property(x => x.IdUsuario).HasColumnName("IdUser");
            entity.Property(x => x.IdRol).HasColumnName("IdRole");
            entity.Property(x => x.Nombres).HasColumnName("FirstName").HasMaxLength(100);
            entity.Property(x => x.Apellidos).HasColumnName("LastName").HasMaxLength(100);
            entity.Property(x => x.NombreUsuario).HasColumnName("UserName").HasMaxLength(50);
            entity.Property(x => x.CorreoElectronico).HasColumnName("Email").HasMaxLength(150);
            entity.Property(x => x.Telefono).HasColumnName("Phone").HasMaxLength(20);
            entity.Property(x => x.FotoUrl).HasColumnName("PhotoUrl").HasMaxLength(500);
            entity.Property(x => x.Activo).HasColumnName("IsActive");
            entity.Property(x => x.FechaCreacion).HasColumnName("CreatedDate");
            entity.Property(x => x.FechaModificacion).HasColumnName("ModifiedDate");
            entity.Property(x => x.IdUsuarioCreacion).HasColumnName("CreatedByUserId");
        });

        modelBuilder.Entity<Credencial>(entity =>
        {
            entity.ToTable("Credential", "sec");
            entity.HasKey(x => x.IdCredencial);
            entity.Property(x => x.IdCredencial).HasColumnName("IdCredential");
            entity.Property(x => x.IdUsuario).HasColumnName("IdUser");
            entity.Property(x => x.PasswordHash).HasColumnName("PasswordHash").HasMaxLength(256);
            entity.Property(x => x.FechaUltimoCambio).HasColumnName("LastChangeDate");
            entity.Property(x => x.DebeCambiarPassword).HasColumnName("MustChangePassword");
            entity.Property(x => x.FechaExpiracion).HasColumnName("ExpirationDate");
        });

        modelBuilder.Entity<SesionUsuario>(entity =>
        {
            entity.ToTable("UserSession", "sec");
            entity.HasKey(x => x.IdSesion);
            entity.Property(x => x.IdSesion).HasColumnName("IdSession");
            entity.Property(x => x.IdUsuario).HasColumnName("IdUser");
            entity.Property(x => x.Token).HasColumnName("Token");
            entity.Property(x => x.DireccionIP).HasColumnName("IPAddress").HasMaxLength(45);
            entity.Property(x => x.UserAgent).HasColumnName("UserAgent").HasMaxLength(500);
            entity.Property(x => x.FechaInicio).HasColumnName("StartDate");
            entity.Property(x => x.FechaExpiracion).HasColumnName("ExpirationDate");
            entity.Property(x => x.FechaCierre).HasColumnName("EndDate");
            entity.Property(x => x.Activa).HasColumnName("IsActive");
        });
    }
}
