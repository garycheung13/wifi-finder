import csv
import json

with open("nyczips.csv") as raw_zips_csv, open("ziplatlong.csv") as lat_long_csv:
    # create an array of the zip codes
    raw_zips_csv = csv.reader(raw_zips_csv)
    nyc_zip_array = [row[0] for row in raw_zips_csv]

    # use nyc zip list to filter down the lat long csv
    # this will also eliminate the USPS operations specific zip codes
    # that dont coorespond to geographic areas
    lat_long_reader = csv.reader(lat_long_csv)
    results = filter(lambda row: row[0] in nyc_zip_array, lat_long_reader)

    # format the data for json
    results_dict = {}
    for zip_code, lat, lon in results:
        results_dict[zip_code] = [float(lat), float(lon)]

    # output to json file usable by app
    with open("../static/data/nyc_zips.json", "w") as f:
        json.dump(results_dict, f)
