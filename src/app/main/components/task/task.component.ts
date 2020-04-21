import {Component, OnDestroy, OnInit, Pipe, PipeTransform} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TasksService } from '../../../shared/services/tasks.service';
import { TaskModel } from '../../../shared/models/task.model';
import { Subject } from 'rxjs';
import { ButtonCommentModel } from '../../../shared/models/button.comment.model';
import { MessagesModel } from '../../../shared/models/messages.model';
import { PreviousNextNavModels } from '../../../shared/models/previous.next.nav.models';

declare var hljs: any;

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnDestroy {

  task: TaskModel = {};
  previousAndNext: PreviousNextNavModels;
  messages: MessagesModel[] = [];
  buttons: ButtonCommentModel[] = [];
  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tasksService: TasksService) { }

  ngOnInit() {
    this.getTask()
  }

  private getTask() {
    this.route.queryParams.pipe(
      switchMap(res => {
        return this.tasksService.getTask(res.taskId, res.action);
      }),
      switchMap(task => {
        this.task = task.task;
        return this.tasksService.getNextAndPreviousTasks(this.task.id)
      })
    ).pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.previousAndNext = res;
        this.getMessages(this.task.id);
        this.getButtons(this.task.id);
        console.log(this.previousAndNext)
        setTimeout(() => {
            document.querySelectorAll('pre code').forEach((block) => {
              hljs.highlightBlock(block);
            });
          }, 0);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  goToComments(button: ButtonCommentModel) {
    this.router.navigate(['comments'], {
      queryParams: {
        taskId: this.task.id,
        mstatusId: button.id
      }
    });
  }

  private getMessages(taskId: string) {
    this.tasksService.getMessages(taskId)
      .subscribe(res => {
        this.messages = res.messages;
      })
  }

  private getButtons(taskId: string) {
    this.tasksService.getButtonsForTask(taskId)
      .subscribe((buttons) => {
        this.buttons = buttons.mstatuses
      });
  }

  goTo(taskId: string) {
    console.log(this.previousAndNext)
    console.log(taskId)
    this.router.navigate(['task'], {
      queryParams: {
        action: 'task',
        taskId: taskId
      }
    })
  }
}
