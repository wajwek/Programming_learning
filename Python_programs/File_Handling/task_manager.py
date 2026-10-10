import pickle
import shelve

CONFIG_FILE = "conf" 
tasks = {}

def load_configuration():
    default = {
        "data_file": "tasks.pkl",
        "autosave": True
    }

    try:
        with shelve.open(CONFIG_FILE) as file:
            if "config" not in file:
                file["config"] = default
            config = file["config"]
            
            if "data_file" not in config:
                config["data_file"] = default["data_file"]
            if "autosave" not in config:
                config["autosave"] = default["autosave"]

            file["config"] = config
            return config
    except Exception as e:
        print("Error ->", e, "Setting default configuration")
        return default

def save_configuration(config):
    try:
        with shelve.open(CONFIG_FILE) as file:
            file["config"] = config
        print("Configuration saved.")
    except Exception:
        print("Failed to save configuration.")

def load_state(file_path):
    global tasks
    try:
        with open(file_path, 'rb') as f:
            data = pickle.load(f)
            if isinstance(data, dict):
                tasks = data
            else:
                print("State file has invalid format. Setting empty list")
                tasks = {}
    except FileNotFoundError:
        print("State file not found.")
        tasks = {}
    except (pickle.UnpicklingError, EOFError):
        print("Pickle file is corrupted.")
        tasks = {}
    except Exception as e:
        print("Error ->", e, "Setting empty list")
        tasks = {}

def save_state(file_path):
    try:
        with open(file_path, 'wb') as f:
            pickle.dump(tasks, f)
        print("Saved.")
    except Exception as e:
        print("Failed to save state ->", e)

def display():
    print("\n--- Task List ---")
    for category, task_list in tasks.items():
        print(f"Category: {category}")
        for i, task in enumerate(task_list):
            description = task[0]
            status = task[1]
            mark = "[x]" if status else "[ ]"
            print(f"  {i}. {mark} {description}")
    print("-----------------")

def add_task(file_path):
    category = input("Enter category: ").strip()
    description = input("Task description: ").strip()

    if not category:
        print("Category cannot be empty.")
        return
    if not description:
        print("Task description cannot be empty.")
        return

    if category not in tasks:
        tasks[category] = []

    tasks[category].append((description, False))
    save_state(file_path)

def mark_completed(file_path):
    category = input("Enter category: ").strip()

    if category in tasks:
        number = input("Enter task number (from 0): ").strip()
        try:
            number = int(number)
        except ValueError:
            print("Invalid input: number must be an integer.")
            return

        task_list = tasks[category]
        if 0 <= number < len(task_list):
            old_description = task_list[number][0]
            task_list[number] = (old_description, True)
            save_state(file_path)
        else:
            print("Invalid task number.")
    else:
        print("Category does not exist.")

def settings(config):
    while True:
        print("\n--- Settings ---")
        print(f"1 - Change data file (current: {config['data_file']})")
        print(f"2 - Toggle autosave (current: {config['autosave']})")
        print("3 - Back")
        choice = input("Enter option -> ").strip()

        if choice == "1":
            new_file = input("Enter new file name: ").strip()
            if not new_file:
                print("Name cannot be empty.")
            else:
                config["data_file"] = new_file
                save_configuration(config)
                print("Please restart the application")
        elif choice == "2":
            config["autosave"] = not config["autosave"]
            save_configuration(config)
        elif choice == "3":
            break
        else:
            print("Unknown option.")

config = load_configuration()
FILE_PATH = config["data_file"]

load_state(FILE_PATH)

while True:
    print("\n 1 - Display, 2 - Add, 3 - Complete, 4 - Settings, 5 - Exit")
    choice = input("Enter option -> ").strip()

    if choice == '1':
        display()
    elif choice == '2':
        add_task(FILE_PATH)
    elif choice == '3':
        mark_completed(FILE_PATH)
    elif choice == '4':
        settings(config)
        FILE_PATH = config["data_file"]
    elif choice == '5':
        if config.get("autosave", True):
            save_state(FILE_PATH)
        print("Have a nice day!")
        break
    else:
        print("Unknown option.")
