import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { updateCandidateStage } from '../api/candidates';
import StageBadge from './StageBadge';
import { STAGES, STAGE_COLORS } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

/**
 * KanbanBoard - drag-and-drop pipeline view.
 * Uses optimistic updates: moves the card immediately in the UI,
 * then rolls back if the API call fails.
 *
 * @param {Array} candidates - all candidates to display on the board
 * @param {Function} onUpdate - called to refresh candidates after a successful move
 */
const KanbanBoard = ({ candidates, onUpdate }) => {
  const navigate = useNavigate();

  // Build a columns map: { Applied: [...], Screening: [...], ... }
  const buildColumns = (cands) => {
    const cols = {};
    STAGES.forEach((s) => (cols[s] = []));
    cands.forEach((c) => {
      if (cols[c.stage]) cols[c.stage].push(c);
    });
    return cols;
  };

  const [columns, setColumns] = useState(() => buildColumns(candidates));

  // Sync columns when candidates prop changes (e.g., after a refetch)
  // Use a simple effect via useMemo-style update
  const syncedColumns = buildColumns(candidates);

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // Dropped outside a column or same position
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;

    if (sourceStage === destStage) return; // same column, do nothing

    // Find the candidate being moved
    const movedCandidate = syncedColumns[sourceStage][source.index];

    // Optimistic update: move the card in local state immediately
    const newColumns = { ...syncedColumns };
    newColumns[sourceStage] = newColumns[sourceStage].filter((c) => c._id !== movedCandidate._id);
    const updatedCard = { ...movedCandidate, stage: destStage };
    newColumns[destStage] = [
      ...newColumns[destStage].slice(0, destination.index),
      updatedCard,
      ...newColumns[destStage].slice(destination.index),
    ];
    setColumns(newColumns);

    try {
      await updateCandidateStage(movedCandidate._id, destStage);
      toast.success(`Moved ${movedCandidate.name} to ${destStage}`);
      onUpdate(); // refresh from server
    } catch {
      // Roll back the optimistic update
      setColumns(syncedColumns);
      toast.error('Failed to update stage. Changes rolled back.');
    }
  };

  const displayColumns = Object.keys(columns).length ? columns : syncedColumns;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {STAGES.map((stage) => {
          const color = STAGE_COLORS[stage];
          const stageCards = displayColumns[stage] || [];
          return (
            <div key={stage} className="kanban-column">
              <div
                className="kanban-column__header"
                style={{ borderTopColor: color.dot }}
              >
                <span style={{ color: color.text, fontWeight: 700 }}>{stage}</span>
                <span
                  className="kanban-column__count"
                  style={{ backgroundColor: color.bg, color: color.text }}
                >
                  {stageCards.length}
                </span>
              </div>

              <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`kanban-column__body ${snapshot.isDraggingOver ? 'kanban-column__body--over' : ''}`}
                    style={{
                      backgroundColor: snapshot.isDraggingOver ? color.bg : undefined,
                    }}
                  >
                    {stageCards.length === 0 && !snapshot.isDraggingOver && (
                      <div className="kanban-empty">Drop cards here</div>
                    )}
                    {stageCards.map((candidate, index) => (
                      <Draggable
                        key={candidate._id}
                        draggableId={candidate._id}
                        index={index}
                      >
                        {(prov, snap) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            className={`kanban-card ${snap.isDragging ? 'kanban-card--dragging' : ''}`}
                            onClick={() => navigate(`/candidates/${candidate._id}`)}
                          >
                            <div className="kanban-card__name">{candidate.name}</div>
                            <div className="kanban-card__position">
                              {candidate.position || 'No position specified'}
                            </div>
                            {candidate.experience != null && (
                              <div className="kanban-card__exp">
                                🕐 {candidate.experience} yr{candidate.experience !== 1 ? 's' : ''} exp
                              </div>
                            )}
                            <div className="kanban-card__skills">
                              {(candidate.skills || []).slice(0, 3).map((s) => (
                                <span key={s} className="skill-tag">{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
