// Copyright 2021 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Component for display solution modal.
 */

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Interaction } from 'domain/exploration/InteractionObjectFactory';
import { RecordedVoiceovers } from 'domain/exploration/recorded-voiceovers.model';
import { ShortAnswerResponse, Solution } from 'domain/exploration/SolutionObjectFactory';
import { StateCard } from 'domain/state_card/state-card.model';
import { AudioPlayerService } from 'services/audio-player.service';
import { AutogeneratedAudioPlayerService } from 'services/autogenerated-audio-player.service';
import { AudioTranslationManagerService } from '../services/audio-translation-manager.service';
import { HintsAndSolutionManagerService } from '../services/hints-and-solution-manager.service';
import { PlayerPositionService } from '../services/player-position.service';
import { PlayerTranscriptService } from '../services/player-transcript.service';

@Component({
  selector: 'oppia-display-modal',
  templateUrl: './display-solution-modal.component.html'
})
export class DisplaySolutionModalComponent {
  // These properties are initialized using Angular lifecycle hooks
  // and we need to do non-null assertion. For more information, see
  // https://github.com/oppia/oppia/wiki/Guide-on-defining-types#ts-7-1
  COMPONENT_NAME_SOLUTION!: string;
  solution!: Solution;
  solutionContentId!: string;
  displayedCard!: StateCard;
  recordedVoiceovers!: RecordedVoiceovers;
  interaction!: Interaction;
  shortAnswerHtml!: ShortAnswerResponse;
  solutionExplanationHtml!: string;

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private audioPlayerService: AudioPlayerService,
    private audioTranslationManagerService: AudioTranslationManagerService,
    private autogeneratedAudioPlayerService: AutogeneratedAudioPlayerService,
    private hintsAndSolutionManagerService: HintsAndSolutionManagerService,
    private playerPositionService: PlayerPositionService,
    private playerTranscriptService: PlayerTranscriptService
  ) {}

  ngOnInit(): void {
    this.solution = this.hintsAndSolutionManagerService.displaySolution();
    this.solutionContentId = this.solution.explanation.contentId as string;
    this.displayedCard = this.playerTranscriptService.getCard(
      this.playerPositionService.getDisplayedCardIndex());
    this.recordedVoiceovers = this.displayedCard.getRecordedVoiceovers();

    this.audioTranslationManagerService.setSecondaryAudioTranslations(
      this.recordedVoiceovers.getBindableVoiceovers(this.solutionContentId),
      this.solution.explanation.html, this.COMPONENT_NAME_SOLUTION
    );

    this.audioPlayerService.onAutoplayAudio.emit();
    this.interaction = this.displayedCard.getInteraction();
    this.shortAnswerHtml = this.solution.getOppiaShortAnswerResponseHtml(
      this.interaction);
    this.solutionExplanationHtml = (
      this.solution.getOppiaSolutionExplanationResponseHtml());
  }

  closeModal(): void {
    this.audioPlayerService.stop();
    this.autogeneratedAudioPlayerService.cancel();
    this.audioTranslationManagerService.clearSecondaryAudioTranslations();
    this.ngbActiveModal.dismiss('cancel');
  }
}
