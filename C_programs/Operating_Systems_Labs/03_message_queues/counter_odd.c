#include <stdio.h>
#include <unistd.h>
#include <sys/ipc.h>
#include <sys/types.h>
#include <sys/msg.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>

struct msgbuf {
    long mtype;
    char mtext[1];
};

int main() {
    key_t key = ftok(".", 'M');

    int msqid = msgget(key, IPC_CREAT | 0666);
    struct msgbuf start;
    start.mtype = 1;
    start.mtext[0] = 0;
    msgsnd(msqid, &start, 0, 0);
    
    struct msgbuf token;

    for (int i = 1; i < 200; i += 2) {
        if (msgrcv(msqid, &token, 0, 1, 0) != -1) {
            /* Critical section start */
            for (int j = 0; j < i; j++) {
                printf("%d ", i);
                fflush(stdout);
            }
            printf("\n");
            sleep(1);
            /* Critical section end */
        }

        token.mtype = 2;
        token.mtext[0] = 0;
        msgsnd(msqid, &token, 0, 0);
    }
    return 0;
}
