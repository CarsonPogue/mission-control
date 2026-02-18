"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import MemoryCard from "./MemoryCard";
import MemoryModal from "./MemoryModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import { GlassCard } from "@/components/ui/glass-card";

export default function MemoryList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [filterAgent, setFilterAgent] = useState("");

  const allMemories = useQuery(api.memory.list);
  const searchResults = useQuery(
    api.memory.search,
    searchQuery.trim().length > 0
      ? {
          query: searchQuery,
          tag: filterTag || undefined,
          agentId: filterAgent || undefined,
        }
      : "skip"
  );
  const agents = useQuery(api.agents.list);

  const [selectedMemory, setSelectedMemory] = useState<Doc<"memories"> | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const memories = searchQuery.trim() ? searchResults : allMemories;
  const isLoading = memories === undefined;

  const allTags = Array.from(
    new Set(allMemories?.flatMap((m) => m.tags) ?? [])
  ).sort();

  const filteredMemories = (memories ?? []).filter((m) => {
    if (filterTag && !m.tags.includes(filterTag)) return false;
    if (filterAgent && m.agentId !== filterAgent) return false;
    return true;
  });

  return (
    <div>
      {/* Search + Filters */}
      <GlassCard glowEffect={false} className="flex items-center gap-3 mb-5 flex-wrap px-4 py-3">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search memories..."
          className="flex-1 min-w-[200px]"
        />
        <Select value={filterTag || "all"} onValueChange={(val) => setFilterTag(val === "all" ? "" : val)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterAgent || "all"} onValueChange={(val) => setFilterAgent(val === "all" ? "" : val)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Agents</SelectItem>
            {agents?.map((a) => (
              <SelectItem key={a._id} value={a.name}>{a.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => setCreateOpen(true)}>+ Add Memory</Button>
      </GlassCard>

      {/* Memory list */}
      {isLoading ? (
        <LoadingState label="Loading memories..." />
      ) : filteredMemories.length === 0 ? (
        <EmptyState
          title="No memories yet"
          description="Memories are created by agents after significant task completions, or you can add them manually."
          action={<Button onClick={() => setCreateOpen(true)}>+ Add Memory</Button>}
        />
      ) : (
        <div className="grid gap-3 stagger-children">
          {filteredMemories.map((memory) => (
            <MemoryCard
              key={memory._id}
              memory={memory}
              onClick={() => {
                setSelectedMemory(memory);
                setViewOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <MemoryModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        memory={selectedMemory}
      />
      <MemoryModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
