/*-
 * #%L
 * Arcade Analytics
 * %%
 * Copyright (C) 2018 - 2019 ArcadeAnalytics
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';

import { JhiMetricsMonitoringModalComponent } from './metrics-modal.component';
import { JhiMetricsService } from './metrics.service';
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'jhi-metrics',
    templateUrl: './metrics.component.html'
})
export class JhiMetricsMonitoringComponent implements OnInit {
    metrics: any = {};
    cachesStats: any = {};
    servicesStats: any = {};
    updatingMetrics = true;
    JCACHE_KEY: string;

    constructor(
        private modalService: BsModalService,
        private metricsService: JhiMetricsService
    ) {
        this.JCACHE_KEY = 'jcache.statistics';
    }

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this.updatingMetrics = true;
        this.metricsService.getMetrics().subscribe((metricsRes: HttpResponse<any>) => {
            const metrics = metricsRes.body;
            this.metrics = metrics;
            this.updatingMetrics = false;
            this.servicesStats = {};
            this.cachesStats = {};
            Object.keys(metrics.timers).forEach((key) => {
                const value = metrics.timers[key];
                if (key.includes('web.rest') || key.includes('service')) {
                    this.servicesStats[key] = value;
                }
            });
            Object.keys(metrics.gauges).forEach((key) => {
                if (key.includes('jcache.statistics')) {
                    const value = metrics.gauges[key].value;
                    // remove gets or puts
                    const index = key.lastIndexOf('.');
                    const newKey = key.substr(0, index);

                    // Keep the name of the domain
                    this.cachesStats[newKey] = {
                        'name': this.JCACHE_KEY.length,
                        'value': value
                    };
                }
            });
        });
    }

    refreshThreadDumpData() {
        this.metricsService.threadDump().subscribe((data) => {
            const modalRef  = this.modalService.show(JhiMetricsMonitoringModalComponent);
            modalRef.content.threadDump = data;
        });
    }

    filterNaN(input) {
        if (isNaN(input)) {
            return 0;
        }
        return input;
    }

}
