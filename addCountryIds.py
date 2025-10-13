import pandas as pd
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter

# Input/output CSV
input_file = "Chess_Stats.csv"
output_file = "Chess_Stats_with_Centroids.csv"

# Read CSV
df = pd.read_csv(input_file)

# Initialize geolocator with a rate limiter to avoid being blocked
geolocator = Nominatim(user_agent="chess_map")
geocode = RateLimiter(geolocator.geocode, min_delay_seconds=1)

# Function to get lat/lon from country name
def get_lat_lon(country_name):
    try:
        location = geocode(country_name)
        if location:
            return location.latitude, location.longitude
        else:
            return None, None
    except:
        return None, None

# Apply to all rows
latitudes = []
longitudes = []

for country in df['Country']:
    lat, lon = get_lat_lon(country)
    latitudes.append(lat if lat is not None else 0)
    longitudes.append(lon if lon is not None else 0)

df['Latitude'] = latitudes
df['Longitude'] = longitudes

# Save new CSV
df.to_csv(output_file, index=False)
print(f"Done! Created: {output_file}")
