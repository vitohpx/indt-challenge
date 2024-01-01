FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
WORKDIR /App

# Copy everything
COPY . ./
# Restore as distinct layers
RUN dotnet restore
# Build and publish a release
RUN dotnet publish -c Release -o out

# Stage 2: Migration and Update Stage
FROM build-env AS migration-env
WORKDIR /App

# Copy the previously built output to this stage
COPY --from=build-env /out .

# Add EF Core tools
RUN dotnet tool install --global dotnet-ef --version 7.0.0 --no-cache

# Perform migrations and apply updates
RUN dotnet ef migrations add InitialMigration
RUN dotnet ef database update 


# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /App
COPY --from=build-env /App/out .
ENTRYPOINT ["dotnet", "UserApi.dll"]
