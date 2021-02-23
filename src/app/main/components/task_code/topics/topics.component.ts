import { Component, OnInit } from '@angular/core';
import { TaskCodeService } from '../../../../shared/services/task-code.service';
import { Router } from '@angular/router';
import { TopicModels } from '../../../../shared/models/topic.models';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {

  total = 0;
  topic$ = this.taskCodeService.exercises();
  constructor(private taskCodeService: TaskCodeService,
              private router: Router) { }

  ngOnInit() {
    this.taskCodeService.total()
      .subscribe(res => {
        this.total = res.total;
      });
  }

  goToTasks(topic: TopicModels) {
    this.router.navigate(['topic'], {queryParams: {
      topicId: topic.id
      }})
  }
}