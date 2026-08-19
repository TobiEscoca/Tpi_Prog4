FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY GestorDeTurnos.Domain/GestorDeTurnos.Domain.csproj GestorDeTurnos.Domain/
COPY GestorDeTurnos.Application/GestorDeTurnos.Application.csproj GestorDeTurnos.Application/
COPY GestorDeTurnos.Infrastructure/GestorDeTurnos.Infrastructure.csproj GestorDeTurnos.Infrastructure/
COPY GestorDeTurnos.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:${PORT:-5000}
EXPOSE 5000
ENTRYPOINT ["dotnet", "GestorDeTurnos.dll"]
