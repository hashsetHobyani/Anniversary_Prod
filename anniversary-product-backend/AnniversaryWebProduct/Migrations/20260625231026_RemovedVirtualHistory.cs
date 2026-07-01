using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnniversaryWebProduct.Migrations
{
    /// <inheritdoc />
    public partial class RemovedVirtualHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chats_HistoryInstance_HistoryInstanceId",
                table: "Chats");

            migrationBuilder.DropForeignKey(
                name: "FK_Images_HistoryInstance_HistoryInstanceId",
                table: "Images");

            migrationBuilder.DropForeignKey(
                name: "FK_Videos_HistoryInstance_HistoryInstanceId",
                table: "Videos");

            migrationBuilder.DropIndex(
                name: "IX_Videos_HistoryInstanceId",
                table: "Videos");

            migrationBuilder.DropIndex(
                name: "IX_Images_HistoryInstanceId",
                table: "Images");

            migrationBuilder.DropIndex(
                name: "IX_Chats_HistoryInstanceId",
                table: "Chats");

            migrationBuilder.DropColumn(
                name: "HistoryInstanceId",
                table: "Videos");

            migrationBuilder.DropColumn(
                name: "HistoryInstanceId",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "HistoryInstanceId",
                table: "Chats");

            migrationBuilder.AddColumn<decimal>(
                name: "DurationInSeconds",
                table: "Videos",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DurationInSeconds",
                table: "Videos");

            migrationBuilder.AddColumn<int>(
                name: "HistoryInstanceId",
                table: "Videos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "HistoryInstanceId",
                table: "Images",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "HistoryInstanceId",
                table: "Chats",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Videos_HistoryInstanceId",
                table: "Videos",
                column: "HistoryInstanceId");

            migrationBuilder.CreateIndex(
                name: "IX_Images_HistoryInstanceId",
                table: "Images",
                column: "HistoryInstanceId");

            migrationBuilder.CreateIndex(
                name: "IX_Chats_HistoryInstanceId",
                table: "Chats",
                column: "HistoryInstanceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Chats_HistoryInstance_HistoryInstanceId",
                table: "Chats",
                column: "HistoryInstanceId",
                principalTable: "HistoryInstance",
                principalColumn: "HistoryInstanceId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Images_HistoryInstance_HistoryInstanceId",
                table: "Images",
                column: "HistoryInstanceId",
                principalTable: "HistoryInstance",
                principalColumn: "HistoryInstanceId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Videos_HistoryInstance_HistoryInstanceId",
                table: "Videos",
                column: "HistoryInstanceId",
                principalTable: "HistoryInstance",
                principalColumn: "HistoryInstanceId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
