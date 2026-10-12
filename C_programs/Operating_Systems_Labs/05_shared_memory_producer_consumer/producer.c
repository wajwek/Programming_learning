#include <sys/types.h> 
#include <sys/shm.h> 
#include <sys/ipc.h> 
#include <sys/sem.h>
#include <stdio.h> 
#include <stdlib.h> 
#include <string.h> 
#include <unistd.h> 

struct sembuf wait = {0, -1, 0};
struct sembuf signal = {1, 1, 0};

union semun { 
    int val;
    struct semid_ds *buf;
    unsigned short *array;
};

int main() {
    int shmID;
    struct Data {
        int ID;
        char Message[100];
    };

    key_t key = ftok(".", 'K');
    shmID = shmget(key, sizeof(struct Data), IPC_CREAT | 0666);
    
    key_t key_sem = ftok(".", 'A');
    int semid = semget(key_sem, 2, IPC_CREAT | IPC_EXCL | 0666);
    if (semid == -1) { perror("Remove semaphores using -> ipcrm -a"); exit(1); }
    union semun arg;
    unsigned short init[2] = {1, 0}; 
    arg.array = init;
    semctl(semid, 0, SETALL, arg);
    
    struct Data *data_ptr;
    data_ptr = (struct Data *) shmat(shmID, 0, 0);
    
    for(;;) {
        semop(semid, &wait, 1);
        int id;
        printf("Enter message ID (0 terminates after reading): ");
        scanf("%d", &id);
        data_ptr->ID = id;
        char message[100];
        printf("\nEnter message (without spaces):\n");
        scanf("%s", message);
        strcpy(data_ptr->Message, message);
        printf("\nWaiting for consumption...\n");
        semop(semid, &signal, 1);
        if (id == 0) {
            break;
        }
    }

    shmdt(data_ptr);
    shmctl(shmID, IPC_RMID, data_ptr);
    semctl(semid, IPC_RMID, data_ptr);
    return 0;
}
