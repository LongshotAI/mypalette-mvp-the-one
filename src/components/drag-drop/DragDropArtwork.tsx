
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Edit, Trash2 } from 'lucide-react';
import LazyImage from '@/components/ui/LazyImage';
import { motion } from 'framer-motion';

interface DragDropArtworkProps {
  artworks: any[];
  onReorder: (reorderedArtworks: any[]) => void;
  onEdit?: (artwork: any) => void;
  onDelete?: (artworkId: string) => void;
  readOnly?: boolean;
}

const DragDropArtwork = ({ 
  artworks, 
  onReorder, 
  onEdit, 
  onDelete, 
  readOnly = false 
}: DragDropArtworkProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);
    
    if (!result.destination) return;

    const items = Array.from(artworks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update sort_order for each item
    const reorderedWithOrder = items.map((item, index) => ({
      ...item,
      sort_order: index
    }));

    onReorder(reorderedWithOrder);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  if (readOnly) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {artworks.map((artwork, index) => (
          <motion.div
            key={artwork.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div className="aspect-square">
                <LazyImage
                  src={artwork.image_url}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium truncate">{artwork.title}</h3>
                {artwork.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {artwork.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {artwork.year && (
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      {artwork.year}
                    </span>
                  )}
                  {artwork.medium && (
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      {artwork.medium}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <Droppable droppableId="artworks" direction="vertical">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-4 ${snapshot.isDraggingOver ? 'bg-muted/20 rounded-lg p-2' : ''}`}
          >
            {artworks.map((artwork, index) => (
              <Draggable key={artwork.id} draggableId={artwork.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`${snapshot.isDragging ? 'opacity-50 rotate-2' : ''}`}
                  >
                    <Card className={`transition-all duration-200 ${
                      snapshot.isDragging ? 'shadow-lg ring-2 ring-primary' : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div
                            {...provided.dragHandleProps}
                            className="flex items-center cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded"
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                          
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <LazyImage
                              src={artwork.image_url}
                              alt={artwork.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{artwork.title}</h3>
                            {artwork.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {artwork.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {artwork.year && (
                                <span className="text-xs bg-muted px-2 py-1 rounded">
                                  {artwork.year}
                                </span>
                              )}
                              {artwork.medium && (
                                <span className="text-xs bg-muted px-2 py-1 rounded">
                                  {artwork.medium}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            {onEdit && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(artwork)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {onDelete && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(artwork.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragDropArtwork;
