import PDFDocument from 'pdfkit';

/**
 * Formats a number as INR currency (e.g., 25,000)
 */
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '-';
  return amount.toLocaleString('en-IN');
};

/**
 * Generates a structured PDF for a university's fee structure
 * @param {Object} university University object from DB
 * @param {res} res Express response stream
 */
export const generateUniversityPDF = (university, res) => {
  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape',
    margin: 40
  });

  // Pipe to response
  doc.pipe(res);

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${university.shortName.replace(/\s+/g, '_')}_Fee_Structure.pdf"`
  );

  // --- Theme Colors ---
  const primaryBrown = '#9E7755'; // Main header background (bronze/brown)
  const lightBeige = '#F4EDE4'; // Page accent beige
  const borderGrey = '#D2C8BE'; // Table grid lines
  const textDark = '#2C2520'; // Primary dark text
  const textWhite = '#FFFFFF';

  // --- Title Header Block ---
  // Draw primary brown box
  doc.rect(40, 40, 762, 80).fill(primaryBrown);
  
  // Write Title
  doc.fillColor(textWhite);
  doc.font('Helvetica-Bold').fontSize(22);
  doc.text(university.name.toUpperCase(), 40, 58, {
    align: 'center',
    width: 762
  });

  // Write Subtitle
  doc.font('Helvetica').fontSize(11);
  const subtitleText = university.mode === 'Online'
    ? 'Fee Structure — Online Courses | All amounts in INR'
    : 'Fee Structure — Distance Courses | All amounts in INR';
  doc.text(subtitleText, 40, 92, {
    align: 'center',
    width: 762
  });

  // --- Columns Configuration based on University ---
  let columns = [];
  if (university.shortName.toUpperCase().includes('AMITY')) {
    columns = [
      { label: 'S.No', key: 'sno', width: 45 },
      { label: 'Course', key: 'course', width: 90 },
      { label: 'Specialization', key: 'spec', width: 227 },
      { label: 'Academic Fees (Per Sem)', key: 'semFee', width: 200, align: 'right' },
      { label: 'Academic Fees (Yearly)', key: 'yearFee', width: 200, align: 'right' }
    ];
  } else if (university.shortName.toUpperCase().includes('LPU')) {
    columns = [
      { label: 'S.No', key: 'sno', width: 45 },
      { label: 'Course', key: 'course', width: 90 },
      { label: 'Specialisation', key: 'spec', width: 227 },
      { label: 'Academic Fees (Per Sem)', key: 'semFee', width: 133, align: 'right' },
      { label: 'Exam Fees (Per Sem)', key: 'examFee', width: 133, align: 'right' },
      { label: 'Total (Per Sem)', key: 'totalSem', width: 134, align: 'right' }
    ];
  } else {
    // Mangalayatan (Online or Distance)
    columns = [
      { label: 'SR. NO.', key: 'sno', width: 60 },
      { label: 'Course', key: 'course', width: 252 },
      { label: 'Semesters', key: 'semesters', width: 90, align: 'center' },
      { label: 'Reg. Fee (One Time)', key: 'regFee', width: 120, align: 'right' },
      { label: 'Exam Fees (Yearly)', key: 'examFee', width: 120, align: 'right' },
      { label: 'Course Fees (Per Year)', key: 'courseFee', width: 120, align: 'right' }
    ];
  }

  // --- Draw Table Header ---
  const startX = 40;
  let startY = 140;
  const rowHeight = 22;

  // Header Row Background
  doc.rect(startX, startY, 762, rowHeight).fill(primaryBrown);

  // Header Text
  doc.fillColor(textWhite).font('Helvetica-Bold').fontSize(10);
  let currentX = startX;
  columns.forEach(col => {
    const textOptions = { width: col.width - 10, align: col.align || 'left' };
    const xPos = col.align === 'right' ? currentX + 5 : currentX + 5;
    doc.text(col.label, xPos, startY + 6, textOptions);
    currentX += col.width;
  });

  startY += rowHeight;

  // --- Draw Table Rows ---
  doc.fillColor(textDark).font('Helvetica').fontSize(9);

  university.courses.forEach((course, index) => {
    // Check page boundaries (A4 height is 595, leave margin at bottom)
    if (startY > 520) {
      doc.addPage({ size: 'A4', layout: 'landscape', margin: 40 });
      // Redraw Header on new page
      startY = 40;
      doc.rect(startX, startY, 762, rowHeight).fill(primaryBrown);
      doc.fillColor(textWhite).font('Helvetica-Bold').fontSize(10);
      let newPageX = startX;
      columns.forEach(col => {
        const textOptions = { width: col.width - 10, align: col.align || 'left' };
        doc.text(col.label, newPageX + 5, startY + 6, textOptions);
        newPageX += col.width;
      });
      startY += rowHeight;
      doc.fillColor(textDark).font('Helvetica').fontSize(9);
    }

    // Row Background (Zebra Striping)
    if (index % 2 === 1) {
      doc.rect(startX, startY, 762, rowHeight).fill('#F9F6F0');
    } else {
      doc.rect(startX, startY, 762, rowHeight).fill('#FFFFFF');
    }

    // Row Border Bottom
    doc.strokeColor(borderGrey).lineWidth(0.5)
       .moveTo(startX, startY + rowHeight)
       .lineTo(startX + 762, startY + rowHeight)
       .stroke();

    // Row Content Cells
    let cellX = startX;
    columns.forEach(col => {
      let val = '';
      if (col.key === 'sno') {
        val = (index + 1).toString();
      } else if (col.key === 'course') {
        val = course.courseName;
      } else if (col.key === 'spec') {
        val = course.specialization;
      } else if (col.key === 'semFee') {
        val = formatCurrency(course.academicFeesPerSem);
      } else if (col.key === 'yearFee') {
        val = formatCurrency(course.academicFeesYearly);
      } else if (col.key === 'examFee') {
        val = col.align === 'right' && course.examFeesPerSem ? formatCurrency(course.examFeesPerSem) : (course.examFeesYearly ? formatCurrency(course.examFeesYearly) : '-');
      } else if (col.key === 'totalSem') {
        val = formatCurrency(course.totalPerSem);
      } else if (col.key === 'semesters') {
        val = course.semesters ? course.semesters.toString() : '-';
      } else if (col.key === 'regFee') {
        val = formatCurrency(course.registrationFee);
      } else if (col.key === 'courseFee') {
        val = formatCurrency(course.courseFeesPerYear);
      }

      const textOptions = { width: col.width - 10, align: col.align || 'left' };
      doc.text(val, cellX + 5, startY + 6, textOptions);
      cellX += col.width;
    });

    startY += rowHeight;
  });

  // --- Add Registration Note at Bottom ---
  if (university.registrationNote) {
    startY += 15;
    doc.rect(startX, startY, 762, 26).fill(lightBeige);
    
    // Draw thin brown border for note box
    doc.strokeColor(primaryBrown).lineWidth(1)
       .rect(startX, startY, 762, 26).stroke();

    doc.fillColor(primaryBrown).font('Helvetica-BoldOblique').fontSize(9);
    doc.text(university.registrationNote, startX + 10, startY + 8, {
      align: 'center',
      width: 742
    });
  }

  // End Document
  doc.end();
};
