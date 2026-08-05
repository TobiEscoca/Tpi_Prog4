using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestorDeTurnos.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUrlImagenACancha : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UrlImagen",
                table: "Canchas",
                type: "TEXT",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UrlImagen",
                table: "Canchas");
        }
    }
}
