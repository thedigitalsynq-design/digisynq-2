// server/engine/rootCauseGraph.js
// Dynamically builds DAG connecting Raw Signals -> Topic Clusters -> Narratives -> Active Issues -> Root Causes -> Potential Impact

class RootCauseGraphBuilder {
  static build(signals, narratives, issues) {
    const nodes = [];
    const edges = [];

    // If no signals, return empty graph
    if (!signals || signals.length === 0) {
      return { nodes: [], edges: [], message: 'No live signals available to generate root-cause graph.' };
    }

    // 1. Raw Signals layer (sample top 6-8 influential signals)
    const topSignals = signals.slice(0, 8);
    topSignals.forEach((sig, idx) => {
      const nodeId = `sig-node-${idx}`;
      nodes.push({
        id: nodeId,
        type: 'SIGNAL',
        label: sig.source,
        subtitle: sig.title.slice(0, 45) + '...',
        sentiment: sig.sentimentLabel,
        category: sig.sourceCategory,
        url: sig.url,
        x: 40,
        y: 60 + idx * 75
      });
    });

    // 2. Narratives layer (top 4-6 narratives)
    const topNarratives = narratives.slice(0, 5);
    topNarratives.forEach((nar, idx) => {
      const narNodeId = `nar-node-${idx}`;
      nodes.push({
        id: narNodeId,
        type: 'NARRATIVE',
        label: nar.topicLabel,
        subtitle: `${nar.signalCount} signals (${nar.velocityTrend})`,
        sentiment: nar.type,
        lifecycle: nar.lifecycle,
        velocity: nar.velocityScore,
        x: 320,
        y: 80 + idx * 95
      });

      // Connect signals to matching narratives
      topSignals.forEach((sig, sIdx) => {
        if (nar.signals.some(s => s.id === sig.id)) {
          edges.push({
            id: `edge-sig-nar-${sIdx}-${idx}`,
            source: `sig-node-${sIdx}`,
            target: narNodeId,
            strength: sig.sentimentLabel === nar.type ? 'STRONG' : 'WEAK'
          });
        }
      });
    });

    // 3. Active Issues layer
    const issueList = issues.activeIssues || [];
    issueList.slice(0, 4).forEach((iss, idx) => {
      const issNodeId = `iss-node-${idx}`;
      nodes.push({
        id: issNodeId,
        type: 'ISSUE',
        label: iss.topic,
        subtitle: `Severity: ${iss.severity} (${iss.damageRiskEstimate}% risk)`,
        severity: iss.severity,
        risk: iss.damageRiskEstimate,
        x: 620,
        y: 100 + idx * 110
      });

      // Connect narrative to issue
      topNarratives.forEach((nar, nIdx) => {
        if (iss.narrativeId === nar.id || iss.topicKey === nar.topicKey) {
          edges.push({
            id: `edge-nar-iss-${nIdx}-${idx}`,
            source: `nar-node-${nIdx}`,
            target: issNodeId,
            severity: iss.severity
          });
        }
      });

      // 4. Root Causes & Potential Impact nodes
      (iss.contributingFactors || []).slice(0, 2).forEach((factor, fIdx) => {
        const factorId = `factor-node-${idx}-${fIdx}`;
        nodes.push({
          id: factorId,
          type: 'ROOT_FACTOR',
          label: 'Contributing Root Factor',
          subtitle: factor.slice(0, 50) + '...',
          x: 900,
          y: 80 + (idx * 2 + fIdx) * 80
        });

        edges.push({
          id: `edge-iss-factor-${idx}-${fIdx}`,
          source: issNodeId,
          target: factorId
        });
      });
    });

    // 5. Potential Impact terminal node (if any issues exist)
    if (issueList.length > 0) {
      const impactNodeId = 'impact-terminal-node';
      const maxSeverity = issues.hasCriticalIssue ? 'CRITICAL' : 'ELEVATED';
      nodes.push({
        id: impactNodeId,
        type: 'BUSINESS_IMPACT',
        label: 'Reputation & Box Office Impact',
        subtitle: maxSeverity === 'CRITICAL' ? 'Weekend drop-off & negative WOM acceleration' : 'Audience churn in sensitive demographic pockets',
        severity: maxSeverity,
        x: 1180,
        y: 220
      });

      // Link factors or issues to impact
      issueList.slice(0, 3).forEach((iss, idx) => {
        edges.push({
          id: `edge-iss-impact-${idx}`,
          source: `iss-node-${idx}`,
          target: impactNodeId
        });
      });
    }

    return { nodes, edges, generatedAt: new Date().toISOString() };
  }
}

module.exports = { RootCauseGraphBuilder };
