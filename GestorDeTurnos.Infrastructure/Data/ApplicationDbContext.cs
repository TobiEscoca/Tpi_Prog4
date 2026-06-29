using GestorDeTurnos.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GestorDeTurnos.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Complejo> Complejos { get; set; }
        public DbSet<Cancha> Canchas { get; set; }
        public DbSet<Turno> Turnos { get; set; }
        public DbSet<Notificacion> Notificaciones { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Usuario
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(u => u.IdUsuario);
                entity.Property(u => u.Email).IsRequired().HasMaxLength(150);
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.Nombre).IsRequired().HasMaxLength(100);
                entity.Property(u => u.PasswordHash).IsRequired().HasMaxLength(256);
                entity.Property(u => u.Rol).HasConversion<string>();
            });

            // Complejo
            modelBuilder.Entity<Complejo>(entity =>
            {
                entity.HasKey(c => c.IdComplejo);
                entity.Property(c => c.Nombre).IsRequired().HasMaxLength(100);
                entity.Property(c => c.Direccion).IsRequired().HasMaxLength(200);
                entity.Property(c => c.Telefono).HasMaxLength(20);
                entity.Property(c => c.Email).HasMaxLength(150);
                entity.HasOne(c => c.Dueno)
                      .WithMany(u => u.Complejos)
                      .HasForeignKey(c => c.IdDueno)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Cancha
            modelBuilder.Entity<Cancha>(entity =>
            {
                entity.HasKey(c => c.IdCancha);
                entity.Property(c => c.Nombre).IsRequired().HasMaxLength(100);
                entity.Property(c => c.PrecioHora).HasColumnType("decimal(10,2)");
                entity.HasOne(c => c.Complejo)
                      .WithMany(co => co.Canchas)
                      .HasForeignKey(c => c.IdComplejo)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Turno
            modelBuilder.Entity<Turno>(entity =>
            {
                entity.HasKey(t => t.IdTurno);
                entity.Property(t => t.Estado).HasConversion<string>();
                entity.HasOne(t => t.Cliente)
                      .WithMany(u => u.Turnos)
                      .HasForeignKey(t => t.IdCliente)
                      .IsRequired(false)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(t => t.Cancha)
                      .WithMany(c => c.Turnos)
                      .HasForeignKey(t => t.IdCancha)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Notificacion
            modelBuilder.Entity<Notificacion>(entity =>
            {
                entity.HasKey(n => n.IdNotificacion);
                entity.Property(n => n.Mensaje).IsRequired().HasMaxLength(500);
                entity.Property(n => n.Destinatario).IsRequired().HasMaxLength(150);
                entity.HasOne(n => n.Turno)
                      .WithMany(t => t.Notificaciones)
                      .HasForeignKey(n => n.IdTurno)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
