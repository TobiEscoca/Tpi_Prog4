using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestorDeTurnos.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAdminSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "IdUsuario",
                keyValue: 99);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Usuarios",
                columns: new[] { "IdUsuario", "Activo", "Email", "FechaRegistro", "Nombre", "PasswordHash", "Rol" },
                values: new object[] { 99, true, "admin@futbol5.com", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Admin Inicial", "$2a$11$e876b6R6zH6H6vK6zH6H6e9Z4O6vK6zH6H6vK6zH6H6vK6zH6H6vK", "AdministradorGeneral" });
        }
    }
}
