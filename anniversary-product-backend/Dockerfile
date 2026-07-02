# ---- Build stage ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY AnniversaryWebProduct/*.csproj ./AnniversaryWebProduct/
RUN dotnet restore ./AnniversaryWebProduct/

COPY . .
RUN dotnet publish ./AnniversaryWebProduct/ -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-8080} dotnet AnniversaryWebProduct.dll"]