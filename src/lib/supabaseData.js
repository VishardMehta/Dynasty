// =============================================
// Dynasty — Supabase Data Layer
// All database operations (save, load, sync)
// =============================================

import { supabase } from './supabase';

// --- Get or Create Default Project ---
export async function getProject() {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .limit(1)
        .maybeSingle();

    if (error || !data) {
        // Create default project
        const { data: newProject } = await supabase
            .from('projects')
            .insert({
                name: 'Marina Bay Tower — Phase 2',
                location: 'Singapore',
                contractor: 'BuildCorp International',
                start_date: '2025-09-15',
                estimated_end: '2027-03-30',
                current_floor: 14,
                total_floors: 28,
                completion_percent: 42,
            })
            .select()
            .single();
        return newProject;
    }
    return data;
}

// --- Save Components ---
export async function saveComponents(projectId, components) {
    // Delete existing components for this project
    await supabase.from('components').delete().eq('project_id', projectId);

    // Insert new ones
    const rows = components.map(c => ({
        id: c.id,
        project_id: projectId,
        type: c.type,
        name: c.name,
        dims: c.dims,
        length_m: c.length_m,
        width_m: c.width_m,
        height_m: c.height_m,
        qty: c.qty,
        area: c.area,
        weight_kg: c.weight_kg,
        floor_start: c.floor_start,
        floor_end: c.floor_end,
        material: c.material,
        confidence: c.confidence,
        status: c.status,
    }));

    const { error } = await supabase.from('components').insert(rows);
    if (error) console.error('Save components error:', error);
}

// --- Load Components ---
export async function loadComponents(projectId) {
    const { data, error } = await supabase
        .from('components')
        .select('*')
        .eq('project_id', projectId)
        .order('id');

    if (error) { console.error('Load components error:', error); return []; }
    return data || [];
}

// --- Save Kits ---
export async function saveKits(projectId, kits) {
    await supabase.from('kits').delete().eq('project_id', projectId);

    const rows = kits.map(k => ({
        id: k.id,
        project_id: projectId,
        task: k.task,
        schedule: k.schedule,
        status: k.status,
        items: k.items,
        total_weight: k.totalWeight,
        total_weight_num: k.totalWeightNum || 0,
        utilization: k.utilization,
    }));

    const { error } = await supabase.from('kits').insert(rows);
    if (error) console.error('Save kits error:', error);
}

// --- Load Kits ---
export async function loadKits(projectId) {
    const { data, error } = await supabase
        .from('kits')
        .select('*')
        .eq('project_id', projectId)
        .order('id');

    if (error) { console.error('Load kits error:', error); return []; }
    return (data || []).map(k => ({
        ...k,
        totalWeight: k.total_weight,
        totalWeightNum: k.total_weight_num,
    }));
}

// --- Save BoQ ---
export async function saveBoQ(projectId, boqItems) {
    await supabase.from('boq_items').delete().eq('project_id', projectId);

    const rows = boqItems.map(b => ({
        id: b.id,
        project_id: projectId,
        item: b.item,
        unit: b.unit,
        ai_qty: b.aiQty,
        manual_qty: b.manualQty,
        rate: b.rate,
        variance: b.variance,
    }));

    const { error } = await supabase.from('boq_items').insert(rows);
    if (error) console.error('Save BoQ error:', error);
}

// --- Load BoQ ---
export async function loadBoQ(projectId) {
    const { data, error } = await supabase
        .from('boq_items')
        .select('*')
        .eq('project_id', projectId)
        .order('id');

    if (error) { console.error('Load BoQ error:', error); return []; }
    return (data || []).map(b => ({
        ...b,
        aiQty: b.ai_qty,
        manualQty: b.manual_qty,
    }));
}

// --- Save Activity Log ---
export async function saveActivity(projectId, type, text) {
    const { error } = await supabase.from('activity_log').insert({
        project_id: projectId,
        type,
        text,
        time: 'Just now',
    });
    if (error) console.error('Save activity error:', error);
}

// --- Load Activity Log ---
export async function loadActivities(projectId) {
    const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) { console.error('Load activities error:', error); return []; }
    return data || [];
}

// --- Save Upload Info ---
export async function saveUpload(projectId, info) {
    const { error } = await supabase.from('uploads').insert({
        project_id: projectId,
        file_name: info.fileName,
        file_size: info.fileSize,
        component_count: info.componentCount,
        total_qty: info.totalQty,
        process_time: info.processTime,
        avg_confidence: info.avgConfidence,
    });
    if (error) console.error('Save upload error:', error);
}

// --- Load Latest Upload ---
export async function loadLatestUpload(projectId) {
    const { data, error } = await supabase
        .from('uploads')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) return null;
    return data ? {
        fileName: data.file_name,
        fileSize: data.file_size,
        componentCount: data.component_count,
        totalQty: data.total_qty,
        processTime: data.process_time,
        avgConfidence: data.avg_confidence,
    } : null;
}

// --- Update Kit Status ---
export async function updateKitStatusDB(kitId, newStatus) {
    const { error } = await supabase
        .from('kits')
        .update({ status: newStatus })
        .eq('id', kitId);
    if (error) console.error('Update kit status error:', error);
}
