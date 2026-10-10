import datetime

def add_record(record):
    with open("employee_database.csv", 'a+') as db:
        record_str = ';'.join(r for r in record)
        db.write('\n' + record_str)
        add_time = datetime.datetime.now()
    db.close()
    with open("log_file", 'a+') as log_file:
        log_file.write(f"\n{add_time} Added record: {record_str}")
    log_file.close()

def display_database(records_database):
    show_time = datetime.datetime.now()
    for record in records_database:
        print(record[1], record[2])
    with open("log_file", 'a+') as log_file:
        log_file.write(f"\n{show_time} Displayed database")
    log_file.close()

def search_record(records_database, search_id):
    search_time = datetime.datetime.now()
    for record in records_database:
        if record[0] == str(search_id):
            print(record)
            break
    with open("log_file", 'a+') as log_file:
        log_file.write(f"\n{search_time} Searched for ID no. {search_id}")
    log_file.close()

def start():
    with open("employee_database.csv", 'r') as db_raw:
        db = []
        for record_raw in db_raw.readlines():
            db.append(record_raw.strip().split(';'))
        choice = int(input("Choose action (1 - add record, 2 - display database, 3 - search by ID, 4 - display logs, 5 - exit) \n"))
        db_raw.close()
        
        match choice:
            case 1:
                record = input("Enter record values separated by space (ID Name Surname Position Salary): ")
                record = record.strip().split(" ")
                db_ids = [r[0] for r in db]
                if record[0] in db_ids: 
                    print("Invalid ID")
                    start()
                else:
                    add_record(record)
                    start()
            case 2:
                display_database(db)
                start()
            case 3:
                a = input("Enter ID: ")
                search_record(db, a)
                start()
            case 4:
                show_log = datetime.datetime.now()
                with open("log_file", 'a') as log_file:
                    log_file.write(f"\n{show_log} Displayed logs")
                log_file.close()

                with open("log_file", 'r') as logs:
                    for log in logs.readlines():
                        print(log.strip())
                logs.close()
                
                start()
            case 5:
                print("Have a nice day!")

start()
