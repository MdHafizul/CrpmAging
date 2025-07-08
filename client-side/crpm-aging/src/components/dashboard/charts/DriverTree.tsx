import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Card from '../../ui/Card';
import { formatCurrency } from '../../../utils/formatter';

interface DriverTreeProps {
  driverTreeData?: {
    category: string;
    debtAmount: number;
    numOfAcc: number;
    color: string;
    type: 'government' | 'non-government';
    status?: 'active' | 'inactive';
  }[] | undefined;
}

const DriverTree: React.FC<DriverTreeProps> = ({ driverTreeData }) => {
  const [selectedDriverNode, setSelectedDriverNode] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  // Process driver tree data with proper Active/Inactive -> Government/Non-Government structure
  const processedDriverData = useMemo(() => {
    if (!driverTreeData) {
      // Default data structure for account classes under Active/Inactive
      return [
        // Active Government
        { category: 'OPCG', debtAmount: 2500000, numOfAcc: 150, color: '#3b82f6', type: 'government' as const, status: 'active' as const },
        { category: 'LPCG', debtAmount: 1800000, numOfAcc: 120, color: '#10b981', type: 'government' as const, status: 'active' as const },
        // Active Non-Government
        { category: 'OPCN', debtAmount: 3200000, numOfAcc: 200, color: '#ec4899', type: 'non-government' as const, status: 'active' as const },
        { category: 'LPCN', debtAmount: 2100000, numOfAcc: 180, color: '#f59e0b', type: 'non-government' as const, status: 'active' as const },
        // Inactive Government
        { category: 'OPCG', debtAmount: 1200000, numOfAcc: 80, color: '#6366f1', type: 'government' as const, status: 'inactive' as const },
        { category: 'LPCG', debtAmount: 900000, numOfAcc: 60, color: '#059669', type: 'government' as const, status: 'inactive' as const },
        // Inactive Non-Government
        { category: 'OPCN', debtAmount: 1600000, numOfAcc: 100, color: '#db2777', type: 'non-government' as const, status: 'inactive' as const },
        { category: 'LPCN', debtAmount: 1050000, numOfAcc: 90, color: '#d97706', type: 'non-government' as const, status: 'inactive' as const }
      ];
    }
    return driverTreeData;
  }, [driverTreeData]);

  // Enhanced horizontal driver tree structure with Active/Inactive -> Government/Non-Government
  const driverTreeStructure = useMemo(() => {
    const totalDebt = processedDriverData.reduce((sum, item) => sum + item.debtAmount, 0);
    
    // Group by status first (Active/Inactive)
    const activeData = processedDriverData.filter(item => item.status === 'active');
    const inactiveData = processedDriverData.filter(item => item.status === 'inactive');
    
    const activeTotal = activeData.reduce((sum, item) => sum + item.debtAmount, 0);
    const inactiveTotal = inactiveData.reduce((sum, item) => sum + item.debtAmount, 0);
    
    // Create structure for each status
    const createStatusBranch = (data: any[], statusName: string, statusTotal: number) => {
      const governmentData = data.filter(item => item.type === 'government');
      const nonGovernmentData = data.filter(item => item.type === 'non-government');
      
      const governmentTotal = governmentData.reduce((sum, item) => sum + item.debtAmount, 0);
      const nonGovernmentTotal = nonGovernmentData.reduce((sum, item) => sum + item.debtAmount, 0);
      
      return {
        name: statusName,
        value: statusTotal,
        color: statusName === 'Active' ? '#059669' : '#dc2626',
        level: 1,
        percentage: ((statusTotal / totalDebt) * 100).toFixed(1),
        children: [
          {
            name: 'Government',
            value: governmentTotal,
            color: '#3b82f6',
            level: 2,
            percentage: statusTotal > 0 ? ((governmentTotal / statusTotal) * 100).toFixed(1) : '0',
            children: governmentData.map(item => ({
              name: item.category,
              value: item.debtAmount,
              numOfAcc: item.numOfAcc,
              color: item.color,
              level: 3,
              percentage: governmentTotal > 0 ? ((item.debtAmount / governmentTotal) * 100).toFixed(1) : '0'
            }))
          },
          {
            name: 'Non-Government',
            value: nonGovernmentTotal,
            color: '#ec4899',
            level: 2,
            percentage: statusTotal > 0 ? ((nonGovernmentTotal / statusTotal) * 100).toFixed(1) : '0',
            children: nonGovernmentData.map(item => ({
              name: item.category,
              value: item.debtAmount,
              numOfAcc: item.numOfAcc,
              color: item.color,
              level: 3,
              percentage: nonGovernmentTotal > 0 ? ((item.debtAmount / nonGovernmentTotal) * 100).toFixed(1) : '0'
            }))
          }
        ]
      };
    };
    
    return {
      root: {
        name: 'Total Aged Debt',
        value: totalDebt,
        color: '#1f2937',
        level: 0
      },
      branches: [
        createStatusBranch(activeData, 'Active', activeTotal),
        createStatusBranch(inactiveData, 'Inactive', inactiveTotal)
      ]
    };
  }, [processedDriverData]);

  // Enhanced horizontal driver tree node component
  const HorizontalDriverTreeNode = useCallback(({ node, x, y, level = 0 }: any) => {
    const nodeWidth = level === 0 ? 240 : level === 1 ? 200 : level === 2 ? 180 : 160;
    const nodeHeight = level === 0 ? 100 : level === 1 ? 90 : level === 2 ? 80 : 70;
    const isSelected = selectedDriverNode === node.name;
    const isRoot = level === 0;
    
    const handleClick = () => {
      if (level === 1) { // Active/Inactive level
        if (selectedBranch === node.name) {
          // If clicking the same branch, deselect it
          setSelectedBranch(null);
          setSelectedDriverNode(null);
        } else {
          // Select this branch
          setSelectedBranch(node.name);
          setSelectedDriverNode(node.name);
        }
      } else {
        // For other levels, just toggle selection
        setSelectedDriverNode(isSelected ? null : node.name);
      }
    };
    
    return (
      <motion.g
        initial={{ opacity: 0, scale: 0.5, x: -50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.6, delay: level * 0.2 }}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        <defs>
          <filter id={`h-node-shadow-${node.name.replace(/\s+/g, '')}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow 
              dx="0" 
              dy={isSelected ? "8" : "4"} 
              stdDeviation={isSelected ? "12" : "6"} 
              floodOpacity={isSelected ? "0.25" : "0.15"} 
              floodColor={node.color}
            />
          </filter>
          
          <linearGradient id={`h-node-gradient-${node.name.replace(/\s+/g, '')}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={isSelected ? node.color : 'white'} stopOpacity={1}/>
            <stop offset="100%" stopColor={isSelected ? node.color : '#f8fafc'} stopOpacity={1}/>
          </linearGradient>
        </defs>
        
        {/* Node background with horizontal gradient */}
        <motion.rect
          x={x - nodeWidth/2}
          y={y - nodeHeight/2}
          width={nodeWidth}
          height={nodeHeight}
          rx={isRoot ? 24 : 16}
          fill={`url(#h-node-gradient-${node.name.replace(/\s+/g, '')})`}
          stroke={node.color}
          strokeWidth={isSelected ? 3 : 2}
          filter={`url(#h-node-shadow-${node.name.replace(/\s+/g, '')})`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Node title */}
        <text
          x={x}
          y={y - (nodeHeight/3)}
          textAnchor="middle"
          fill={isSelected ? 'white' : node.color}
          fontSize={level === 0 ? 18 : level === 1 ? 16 : level === 2 ? 14 : 12}
          fontWeight="bold"
        >
          {node.name}
        </text>
        
        {/* Node value */}
        <text
          x={x}
          y={y}
          textAnchor="middle"
          fill={isSelected ? 'white' : '#374151'}
          fontSize={level === 0 ? 14 : level === 1 ? 12 : level === 2 ? 10 : 9}
          fontWeight="600"
        >
          {formatCurrency(node.value, 0, 0)}
        </text>
        
        {/* Additional info for leaf nodes */}
        {level === 3 && (
          <>
            <text
              x={x}
              y={y + 12}
              textAnchor="middle"
              fill={isSelected ? 'white' : '#6b7280'}
              fontSize={8}
              fontWeight="medium"
            >
              {node.numOfAcc} accounts
            </text>
            <text
              x={x}
              y={y + 22}
              textAnchor="middle"
              fill={isSelected ? 'white' : node.color}
              fontSize={9}
              fontWeight="bold"
            >
              {node.percentage}%
            </text>
          </>
        )}
        
        {/* Percentage for branch nodes */}
        {(level === 1 || level === 2) && (
          <text
            x={x}
            y={y + (nodeHeight/3)}
            textAnchor="middle"
            fill={isSelected ? 'white' : node.color}
            fontSize={10}
            fontWeight="bold"
          >
            {node.percentage}%
          </text>
        )}
      </motion.g>
    );
  }, [selectedDriverNode, selectedBranch]);

  // Enhanced horizontal connections with organizational chart style (horizontal + vertical lines)
  const HorizontalDriverTreeConnection = useCallback(({ x1, y1, x2, y2, color, isSelected }: any) => {
    // Calculate the path for L-shaped connection
    const midX = x1 + (x2 - x1) * 0.7; // 70% of the way horizontally
    
    return (
      <motion.g>
        <defs>
          <linearGradient id={`h-connection-gradient-${x2}-${y2}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
            <stop offset="100%" stopColor={color} stopOpacity={0.3}/>
          </linearGradient>
        </defs>
        
        {/* Connection shadow */}
        <motion.g opacity={0.2} transform="translate(2, 2)">
          {/* Horizontal line */}
          <motion.line
            x1={x1}
            y1={y1}
            x2={midX}
            y2={y1}
            stroke={color}
            strokeWidth={isSelected ? 4 : 2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          {/* Vertical line */}
          <motion.line
            x1={midX}
            y1={y1}
            x2={midX}
            y2={y2}
            stroke={color}
            strokeWidth={isSelected ? 4 : 2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          />
          {/* Final horizontal line to target */}
          <motion.line
            x1={midX}
            y1={y2}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={isSelected ? 4 : 2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          />
        </motion.g>
        
        {/* Main connection lines */}
        <motion.g>
          {/* Horizontal line */}
          <motion.line
            x1={x1}
            y1={y1}
            x2={midX}
            y2={y1}
            stroke={`url(#h-connection-gradient-${x2}-${y2})`}
            strokeWidth={isSelected ? 3 : 2}
            strokeDasharray={isSelected ? "none" : "8,4"}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          {/* Vertical line */}
          <motion.line
            x1={midX}
            y1={y1}
            x2={midX}
            y2={y2}
            stroke={color}
            strokeWidth={isSelected ? 3 : 2}
            strokeDasharray={isSelected ? "none" : "6,3"}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          />
          {/* Final horizontal line to target */}
          <motion.line
            x1={midX}
            y1={y2}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={isSelected ? 3 : 2}
            strokeDasharray={isSelected ? "none" : "8,4"}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          />
        </motion.g>
        
        {/* Arrow at end */}
        <motion.polygon
          points={`${x2-12},${y2-8} ${x2-12},${y2+8} ${x2+2},${y2}`}
          fill={color}
          opacity={0.8}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.8 }}
        />
      </motion.g>
    );
  }, []);

  return (
    <Card title="Aged Debt (Positive Balance)">
      <div className="flex justify-between items-center mb-6">
        <div className="text-xs text-gray-500">
          Click nodes to highlight • {selectedDriverNode ? `Selected: ${selectedDriverNode}` : 'Select a node'}
        </div>
      </div>
      
      <div className="relative h-[900px] overflow-hidden bg-gradient-to-r from-gray-50 to-white rounded-lg">
        <svg width="100%" height="100%" viewBox="0 0 1800 900">
          {/* Background grid */}
          <defs>
            <pattern id="h-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#h-grid)" opacity="0.5"/>
          
          {/* Root node - Total Aged Debt */}
          <HorizontalDriverTreeNode 
            node={driverTreeStructure.root}
            x={150}
            y={450}
            level={0}
          />
          
          {/* Level 1: Active/Inactive */}
          {driverTreeStructure.branches.map((statusBranch, statusIndex) => {
            const statusX = 450;
            const statusY = 250 + (statusIndex * 400); // Active at 250, Inactive at 650 - much more spacing
            const isSelected = selectedDriverNode === statusBranch.name;
            
            return (
              <g key={statusBranch.name}>
                {/* Connection from root to status */}
                <HorizontalDriverTreeConnection
                  x1={270}
                  y1={450}
                  x2={350}
                  y2={statusY}
                  color={statusBranch.color}
                  isSelected={isSelected}
                />
                
                {/* Status node */}
                <HorizontalDriverTreeNode 
                  node={statusBranch}
                  x={statusX}
                  y={statusY}
                  level={1}
                />
                
                {/* Level 2: Government/Non-Government */}
                {statusBranch.children.map((typeBranch: any, typeIndex: number) => {
                  const typeX = 750;
                  const typeY = statusY - 100 + (typeIndex * 200); // Much more spacing between Gov/Non-Gov
                  const isTypeSelected = selectedDriverNode === typeBranch.name;
                  
                  return (
                    <g key={`${statusBranch.name}-${typeBranch.name}`}>
                      {/* Connection from status to type */}
                      <HorizontalDriverTreeConnection
                        x1={550}
                        y1={statusY}
                        x2={650}
                        y2={typeY}
                        color={typeBranch.color}
                        isSelected={isTypeSelected}
                      />
                      
                      {/* Type node */}
                      <HorizontalDriverTreeNode 
                        node={typeBranch}
                        x={typeX}
                        y={typeY}
                        level={2}
                      />
                      
                      {/* Level 3: Account Classes */}
                      {typeBranch.children.map((accClass: any, accIndex: number) => {
                        const accX = 1150;
                        const accY = typeY - 75 + (accIndex * 150); // More generous spacing for account classes
                        const isAccSelected = selectedDriverNode === accClass.name;
                        
                        return (
                          <g key={`${statusBranch.name}-${typeBranch.name}-${accClass.name}`}>
                            {/* Connection from type to account class */}
                            <HorizontalDriverTreeConnection
                              x1={840}
                              y1={typeY}
                              x2={1070}
                              y2={accY}
                              color={accClass.color}
                              isSelected={isAccSelected}
                            />
                            
                            {/* Account class node */}
                            <HorizontalDriverTreeNode 
                              node={accClass}
                              x={accX}
                              y={accY}
                              level={3}
                            />
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </g>
            );
          })}
          
 
        </svg>
      </div>
    </Card>
  );
};

export default DriverTree;