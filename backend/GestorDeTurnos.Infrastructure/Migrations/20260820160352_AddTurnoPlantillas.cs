using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestorDeTurnos.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTurnoPlantillas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdPlantilla",
                table: "Turnos",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TurnoPlantillas",
                columns: table => new
                {
                    IdPlantilla = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    IdCancha = table.Column<int>(type: "INTEGER", nullable: false),
                    DiaSemana = table.Column<int>(type: "INTEGER", nullable: false),
                    HoraInicio = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    HoraFin = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    Activo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TurnoPlantillas", x => x.IdPlantilla);
                    table.ForeignKey(
                        name: "FK_TurnoPlantillas_Canchas_IdCancha",
                        column: x => x.IdCancha,
                        principalTable: "Canchas",
                        principalColumn: "IdCancha",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Turnos_IdPlantilla",
                table: "Turnos",
                column: "IdPlantilla");

            migrationBuilder.CreateIndex(
                name: "IX_TurnoPlantillas_IdCancha_DiaSemana_HoraInicio",
                table: "TurnoPlantillas",
                columns: new[] { "IdCancha", "DiaSemana", "HoraInicio" });

            migrationBuilder.AddForeignKey(
                name: "FK_Turnos_TurnoPlantillas_IdPlantilla",
                table: "Turnos",
                column: "IdPlantilla",
                principalTable: "TurnoPlantillas",
                principalColumn: "IdPlantilla",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Turnos_TurnoPlantillas_IdPlantilla",
                table: "Turnos");

            migrationBuilder.DropTable(
                name: "TurnoPlantillas");

            migrationBuilder.DropIndex(
                name: "IX_Turnos_IdPlantilla",
                table: "Turnos");

            migrationBuilder.DropColumn(
                name: "IdPlantilla",
                table: "Turnos");
        }
    }
}
