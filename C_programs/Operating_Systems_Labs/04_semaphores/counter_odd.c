#include <stdio.h>
#include <unistd.h>
#include <sys/ipc.h>
#include <sys/types.h>
#include <sys/sem.h>

struct sembuf wait = {0, -1, 0};
struct sembuf signal = {1, 1, 0};

union semun { 
    int val;
    struct semid_ds *buf;
    unsigned short *array;
};

int main() {
    key_t key = ftok(".", 'A');

    int semid = semget(key, 2, IPC_CREAT | IPC_EXCL | 0666);
    if (semid != -1) {
        union semun arg;
        unsigned short init[2] = {1, 0}; 
        arg.array = init;
        semctl(semid, 0, SETALL, arg);
    } else {
        semid = semget(key, 2, IPC_CREAT | 0666);
    }
    int i;
    for (i = 1; i < 200; i += 2) {
        semop(semid, &wait, 1);
        /* Critical section start */
        for (int j = 0; j < i; j++) {
            printf("%d ", i);
            fflush(stdout);
        }
        printf("\n");
        sleep(1);
        /* Critical section end */
        semop(semid, &signal, 1);
    }
    return 0;
}
