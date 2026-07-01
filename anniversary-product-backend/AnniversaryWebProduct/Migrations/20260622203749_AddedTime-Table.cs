using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AnniversaryWebProduct.Migrations
{
    /// <inheritdoc />
    public partial class AddedTimeTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MemoryItem_Chats_ChatId",
                table: "MemoryItem");

            migrationBuilder.CreateTable(
                name: "Timer",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TimerName = table.Column<string>(type: "text", nullable: false),
                    DateStart = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateEnd = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Timer", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Timer",
                columns: new[] { "Id", "DateEnd", "DateStart", "IsActive", "TimerName" },
                values: new object[] { 1, new DateTime(2025, 6, 25, 12, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 6, 25, 12, 0, 0, 0, DateTimeKind.Utc), true, "Anniversary Date" });

            migrationBuilder.AddForeignKey(
                name: "FK_MemoryItem_Chats_ChatId",
                table: "MemoryItem",
                column: "ChatId",
                principalTable: "Chats",
                principalColumn: "ChatId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MemoryItem_Chats_ChatId",
                table: "MemoryItem");

            migrationBuilder.DropTable(
                name: "Timer");

            migrationBuilder.AddForeignKey(
                name: "FK_MemoryItem_Chats_ChatId",
                table: "MemoryItem",
                column: "ChatId",
                principalTable: "Chats",
                principalColumn: "ChatId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
