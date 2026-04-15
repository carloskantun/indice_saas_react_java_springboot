import { useMemo, useState } from 'react';
import { FileWarning, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { CreateRecordModal } from './components/CreateRecordModal';
import { RecordDetailModal } from './components/RecordDetailModal';
import { RecordFilters } from './components/RecordFilters';
import { RecordsList } from './components/RecordsList';
import { mockEmployees } from './data/employees.mock';
import { mockRecords } from './data/records.mock';
import type { CreateRecordData, EmployeeRecord, RecordFiltersState } from './types/records.types';

export default function Records() {
  const [records, setRecords] = useState<EmployeeRecord[]>(mockRecords);
  const [filters, setFilters] = useState<RecordFiltersState>({
    search: '',
    unit: 'all',
    business: 'all',
    status: 'all',
    type: 'all',
    severity: 'all',
    dateFrom: '',
    dateTo: '',
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<EmployeeRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<EmployeeRecord | null>(null);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const searchLower = filters.search.toLowerCase().trim();
      if (searchLower) {
        const matchesSearch = [
          record.employee.name,
          record.employee.position,
          record.title,
          record.description,
          record.type,
          record.reportedBy.name,
        ].some((value) => value.toLowerCase().includes(searchLower));
        if (!matchesSearch) {
          return false;
        }
      }

      if (filters.unit !== 'all' && record.unit !== filters.unit) {
        return false;
      }

      if (filters.business !== 'all' && record.business !== filters.business) {
        return false;
      }

      if (filters.status !== 'all' && record.status !== filters.status) {
        return false;
      }

      if (filters.type !== 'all' && record.type !== filters.type) {
        return false;
      }

      if (filters.severity !== 'all' && record.severity !== filters.severity) {
        return false;
      }

      const recordDate = new Date(record.eventDate);
      if (filters.dateFrom && recordDate < new Date(filters.dateFrom)) {
        return false;
      }

      if (filters.dateTo) {
        const dateTo = new Date(filters.dateTo);
        dateTo.setHours(23, 59, 59, 999);
        if (recordDate > dateTo) {
          return false;
        }
      }

      return true;
    });
  }, [filters, records]);

  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
    });
  }, [filteredRecords]);

  const stats = useMemo(() => {
    return {
      total: records.length,
      pending: records.filter((record) => record.status === 'pending').length,
      resolved: records.filter((record) => record.status === 'resolved').length,
      highSeverity: records.filter((record) => record.severity === 'high').length,
    };
  }, [records]);

  const handleSaveRecord = (data: CreateRecordData) => {
    const employee = mockEmployees.find((item) => item.id === data.employeeId);
    if (!employee) {
      return;
    }

    if (editingRecord) {
      const updatedRecord: EmployeeRecord = {
        ...editingRecord,
        employee,
        type: data.type,
        severity: data.severity,
        title: data.title,
        description: data.description,
        actionsTaken: data.actionsTaken,
        witnesses: data.witnesses,
        eventDate: new Date(data.eventDate).toISOString(),
        updatedAt: new Date().toISOString(),
        attachments: data.attachments?.map((file, index) => ({
          id: `upload-${editingRecord.id}-${index}`,
          name: file.name,
          size: file.size,
          type: file.type,
          url: '#',
        })) ?? editingRecord.attachments,
      };

      setRecords((current) => current.map((record) => (
        record.id === editingRecord.id ? updatedRecord : record
      )));
    } else {
      const nextId = `${records.length + 1}`;
      const newRecord: EmployeeRecord = {
        id: nextId,
        employee,
        unit: `Unit ${7 + ((records.length + 1) % 4)}`,
        business: employee.department,
        type: data.type,
        severity: data.severity,
        status: 'pending',
        title: data.title,
        description: data.description,
        actionsTaken: data.actionsTaken,
        witnesses: data.witnesses,
        reportedBy: {
          id: 'current-user',
          name: 'Current User',
        },
        eventDate: new Date(data.eventDate).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attachments: data.attachments?.map((file, index) => ({
          id: `upload-${nextId}-${index}`,
          name: file.name,
          size: file.size,
          type: file.type,
          url: '#',
        })),
      };

      setRecords((current) => [newRecord, ...current]);
    }

    setEditingRecord(null);
    setIsCreateModalOpen(false);
  };

  const handleRecordClick = (record: EmployeeRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const handleEditRecord = (record: EmployeeRecord) => {
    setEditingRecord(record);
    setIsDetailModalOpen(false);
    setIsCreateModalOpen(true);
  };

  const handleDeleteRecord = (recordId: string) => {
    setRecords((current) => current.filter((record) => record.id !== recordId));
  };

  const handleDownloadRecord = (record: EmployeeRecord) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${record.title}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; padding: 32px; line-height: 1.6; }
            h1 { margin-bottom: 8px; }
            .meta { color: #6b7280; margin-bottom: 24px; }
            .section { margin-top: 24px; }
            .label { font-size: 12px; text-transform: uppercase; color: #6b7280; margin-bottom: 4px; }
            .box { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-top: 8px; }
          </style>
        </head>
        <body>
          <h1>${record.title}</h1>
          <div class="meta">Record #${record.id}</div>
          <div class="section">
            <div class="label">Employee</div>
            <div class="box">${record.employee.name} · ${record.employee.position}</div>
          </div>
          <div class="section">
            <div class="label">Description</div>
            <div class="box">${record.description}</div>
          </div>
          ${record.actionsTaken ? `
            <div class="section">
              <div class="label">Actions Taken</div>
              <div class="box">${record.actionsTaken}</div>
            </div>
          ` : ''}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gray-100 px-6 py-8 dark:bg-gray-900">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="mb-2 flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-white">
              <FileWarning className="h-8 w-8" />
              Records
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Track incidents, reports and employee history
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            New Record
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          📋 <span className="font-medium text-gray-900 dark:text-white">{stats.total}</span> total records
        </span>
        <span className="text-gray-300 dark:text-gray-600">•</span>
        <span className="flex items-center gap-1.5">
          ⏳ <span className="font-medium text-orange-600 dark:text-orange-400">{stats.pending}</span> pending
        </span>
        <span className="text-gray-300 dark:text-gray-600">•</span>
        <span className="flex items-center gap-1.5">
          ✓ <span className="font-medium text-green-600 dark:text-green-400">{stats.resolved}</span> resolved
        </span>
        <span className="text-gray-300 dark:text-gray-600">•</span>
        <span className="flex items-center gap-1.5">
          🔴 <span className="font-medium text-red-600 dark:text-red-400">{stats.highSeverity}</span> high severity
        </span>
      </div>

      <RecordFilters filters={filters} onFiltersChange={setFilters} />

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {sortedRecords.length} of {records.length} records
      </div>

      <RecordsList
        records={sortedRecords}
        onRecordClick={handleRecordClick}
        onEdit={handleEditRecord}
        onDownload={handleDownloadRecord}
      />

      <CreateRecordModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
        employees={mockEmployees}
        editingRecord={editingRecord}
      />

      <RecordDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        record={selectedRecord}
        onEdit={handleEditRecord}
        onDelete={handleDeleteRecord}
      />
    </div>
  );
}
