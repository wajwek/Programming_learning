#include <sys/types.h> 
#include <sys/shm.h> 
#include <sys/ipc.h> 
#include <sys/sem.h>
#include <stdio.h> 
#include <stdlib.h> 
#include <string.h> 
#include <unistd.h> 

struct sembuf wait = {1, -1, 0};
struct sembuf signal = {0, 1, 0};

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
    shmID = shmget(key, sizeof(struct Data), 0666);
    
    key_t key_sem = ftok(".", 'A');
    int semid = semget(key_sem, 2, 0666);
    struct Data *data_ptr;
    data_ptr = (struct Data *) shmat(shmID, 0, 0);
    
    for(;;) {
        semop(semid, &wait, 1);
        if (data_ptr->ID == 0) {
            break;
        }
        printf("Shared memory content:\n");
        printf("Message ID: %d\n", data_ptr->ID);
        printf("Message:\n%s\n", data_ptr->Message);
        sleep(5);
        semop(semid, &signal, 1);
    }

    shmdt(data_ptr);
    return 0;
}
