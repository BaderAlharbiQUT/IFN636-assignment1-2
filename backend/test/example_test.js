const chai = require('chai');
const sinon = require('sinon');
const Student = require('../models/Student');
const { createStudent } = require('../controllers/studentController');

const { expect } = chai;

describe('CreateStudent Function Test', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should create a new student successfully', async () => {
    const req = {
      user: {
        id: 'teacher123',
      },
      body: {
        name: 'Test Student',
        studentId: 'S12345',
        email: 'student@test.com',
        course: 'IFN636',
      },
    };

    const expectedPayload = {
      teacherId: req.user.id,
      name: req.body.name,
      studentId: req.body.studentId,
      email: req.body.email,
      course: req.body.course,
    };

    const createdStudent = {
      _id: 'abc123',
      ...expectedPayload,
      totalSessions: 0,
      presentCount: 0,
      lateCount: 0,
      absentCount: 0,
      attendanceRate: 0,
    };

    const createStub = sinon.stub(Student, 'create').resolves(createdStudent);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createStudent(req, res);

    expect(createStub.calledOnceWith(expectedPayload)).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdStudent)).to.be.true;
  });

  it('should return 400 when student creation fails', async () => {
    const req = {
      user: {
        id: 'teacher123',
      },
      body: {
        name: 'Bad Student',
        studentId: 'S99999',
        email: 'bad@student.com',
        course: 'IFN636',
      },
    };

    sinon.stub(Student, 'create').throws(new Error('Creation failed'));

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createStudent(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });
});
