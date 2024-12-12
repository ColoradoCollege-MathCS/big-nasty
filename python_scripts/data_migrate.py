import psycopg2
import pandas as pd
from dotenv import load_dotenv
import os
from datetime import datetime

# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

try:
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    print("Connection successful")

    # Load CSV data 
    # UPDATE THIS FILEPATH TO LOCALLY STORED CSV
    csv_file_path = "/Users/danschmidt/Downloads/2020_Amendment_77_Local_Voter_Approval_of_Gaming_Limits.csv"
    data = pd.read_csv(csv_file_path)

    # Insert proposition
    # UPDATE THIS NAME TO PROP NAME
    proposition_name = "Amendment 77: Local Voter Approval of Gaming Limits"
    proposition_description = "TODO"
    proposition_year = 2020
    timestamp = datetime.now()

    insert_proposition_query = """
        INSERT INTO propositions (name, description, year, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s) RETURNING id
    """
    cursor.execute(insert_proposition_query, (proposition_name, proposition_description, proposition_year, timestamp, timestamp))
    proposition_id = cursor.fetchone()[0]
    print(f"Inserted proposition with ID: {proposition_id}")

    # Insert proposition_county_votes
    insert_votes_query = """
        INSERT INTO proposition_county_votes (proposition_id, county_id, yes_count, no_count, updated_at)
        VALUES (%s, %s, %s, %s, %s)
    """

    for index, row in data.iterrows():
        try:
            # Parse County Name
            county_name = row["County"]
            if county_name == "Totals":
                print("Skipping 'Totals' row.")
                continue  # Skip this row
            
            # Parse CSV Data
            yes_count = int(row["Yes\nNone/Unknown"].replace(",", "").replace("None/Unknown", "0"))
            no_count = int(row["No\nNone/Unknown"].replace(",", "").replace("None/Unknown", "0"))
            
            # Fetch County ID
            cursor.execute("SELECT id FROM counties WHERE name = %s", (county_name,))
            county_result = cursor.fetchone()
            if county_result is None:
                print(f"Error: County '{county_name}' not found in the database.")
                continue

            print("Data added for county number: ", county_result[0])
            county_id = county_result[0]

            # Insert Votes Data
            cursor.execute(insert_votes_query, (proposition_id, county_id, yes_count, no_count, timestamp))
        
        except Exception as e:
            print(f"Error inserting row for county '{county_name}': {e}")

    # Commit transaction
    conn.commit()
    print("Data migration completed successfully!")

except Exception as e:
    print(f"An error occurred: {e}")

finally:
    if cursor:
        cursor.close()
    if conn:
        conn.close()
