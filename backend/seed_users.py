import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import User

def create_users():
    users = [
        ('manager1', 'manager123', 'MANAGER', 'Alice', 'Manager'),
        ('staff1', 'staff123', 'STAFF', 'Bob', 'Staff'),
        ('staff2', 'staff223', 'STAFF', 'Charlie', 'Staff'),
        ('resident1', 'resident123', 'RESIDENT', 'David', 'Resident'),
        ('resident2', 'resident223', 'RESIDENT', 'Eve', 'Resident'),
    ]

    for username, password, role, first, last in users:
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(
                username=username,
                password=password,
                role=role,
                first_name=first,
                last_name=last
            )
            print(f"Created {role}: {username}")
        else:
            print(f"User {username} already exists")

if __name__ == '__main__':
    create_users()
